// Copyright (c) 2024, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import { createHash, pbkdf2Sync } from 'crypto';
import { XMLParser } from 'fast-xml-parser';
import HttpClient from './httpClient.mjs';

/**
 * FritzBoxApi is a class to communicate with FRITZ!Box devices.
 */
class FritzBoxApi extends HttpClient {

    /**
     * Default URL of FRITZ!Box device.
     */
    url = 'http://fritz.box';

    /**
     * Object with endpoint routes of FRITZ!Box device. 
     */
    routes = {
        login: '/login_sid.lua?version=2',
        data: '/data.lua',
        foncalls: '/fon_num/foncalls_list.lua?sid={sid}&csv=',
        firmwarecfg: '/cgi-bin/firmwarecfg',
        reboot: '/reboot.lua'
    };

    /**
     * Default time in milliseconds till logout.
     */
    timeInMsTillLogout = 1200 * 1000;

    /**
     * Initializes new instance of FritzBoxApi.
     * 
     * @param {object} options Object with configuration values.
     */
    constructor(options) {
        options = options || {};

        if (!options.url) {
            options.url = this.url;
        }

        super(options.url);

        this.options = options;
    }

    /**
     * Processes authentication by username and password.
     * 
     * @param {string} username String with username of device.
     * @param {string} password String with password of device.
     * @returns Returns whether authentication succeeded.
     */
    async login(username, password) {
        this.options.credentials = { username, password };

        const sessionId = await this.getSessionId();

        this.options.credentials.sid = sessionId;

        return sessionId != null;
    }

    /**
     * Gets session identifier by username and password.
     * 
     * @param {boolean} renew If true, renew of session identifier is forced.
     * @returns Returns string with session identifier.
     */
    async getSessionId(renew) {
        const { credentials: { username, password, sid } } = this.options;

        if (!renew && this.#isValidSid(sid)) return sid;

        const { data, status } = await this.get(this.routes.login);

        if (status === 200) {
            const blockTimeMs = this.#getXmlElementValue(data, 'BlockTime') * 1000;

            if (blockTimeMs > 0) {
                await this.#sleep(blockTimeMs);
            }

            const challenge = this.#getXmlElementValue(data, 'Challenge');

            if (challenge) {
                const sessionId = await this.#calcReqChallengeResp(
                    challenge, username, password
                );

                if (sessionId !== '0000000000000000') {
                    return sessionId;
                }
            }
        }
    }

    /**
     * Gets name of last user.
     * 
     * @returns Returns string with name of last user.
     */
    async getLastUser() {
        const { data, status } = await this.get(this.routes.login);

        if (status === 200) {
            return this.#getXmlElementValue(data, 'User', { last: 1 });
        }
    }

    /**
     * Fetches data by pid and additional options.
     * 
     * @param {object} options Object with configuration values.
     * @returns Returns JSON of responded data.
     */
    async getData(options) {
        const sid = await this.getSessionId();

        if (sid) {
            const { data, status } = await this.post(this.routes.data, { 
                xhr: 1, sid, page: 'overview', xhrId: '', ...options
            });

            if (status === 200) {
                return data;
            }
        }
    }

    /**
     * Fetches fonbook of FRITZ!Box device.
     * 
     * @param {number} phoneBookId Number with identifier of phone book.
     * @returns Returns 
     */
    async getFonBook(phoneBookId = 0) {
        const sid = await this.getSessionId();

        if (sid) {
            const { data, status } = await this.post(this.routes.firmwarecfg, {
                sid,
                PhonebookId: phoneBookId,
                PhonebookExportName: 'Phonebook',
                PhonebookExport: ''
            }, true);

            if (status === 200) {
                const xmlParser = new XMLParser();
                
                return xmlParser.parse(data);
            }
        }
    }

    /**
     * Fetches foncalls of FRITZ!Box device.
     * 
     * @param {number} skip Number with offset to skip results.
     * @param {number} limit Maximum number of results to be returned.
     * @returns Returns object with head and body of foncall entries.
     */
    async getFonCalls(skip = 0, limit) {
        const sid = await this.getSessionId();

        if (sid) {
            const url = this.routes.foncalls.replace('{sid}', sid);
            const { data, status } = await this.get(url);

            if (status === 200) {
                const rows = data.split(/\r?\n|\r|\n/g);

                if (rows.length) {
                    const sep = rows[0].split('=')[1];

                    const [head, ...entries] = rows.slice(1).map(row => row.split(sep));
    
                    return {
                        head,
                        entries: entries.slice(skip, skip + limit || entries.length)
                    };
                }
            }
        }

        return {};
    }

    /**
     * Processes reboot of FRITZ!Box device.
     * 
     * @returns Returns result of reboot process.
     */
    async reboot() {
        const sid = await this.getSessionId();

        if (sid) {
            const result = await this.getData({ page: 'reboot', reboot: 1 });

            if (result?.data?.reboot === 'ok') {
                const { data, status } = await this.post(this.routes.reboot, {
                    ajax: 1, sid, no_sidrenew: 1, xhr: 1, useajax: 1
                });
    
                if (status === 200) {
                    return data;
                }
            }
        }
    }

    /**
     * Calculates the response for a given challenge.
     * 
     * @param {string} challenge String with current challenge of device.
     * @param {string} username String with username of device.
     * @param {string} password String with password of device.
     * @returns Returns binary value in hexadecimal notation.
     */
    async #calcReqChallengeResp(challenge, username, password) {
        const calcResp = challenge.startsWith('2$')
            ? this.#calcPbkdf2Resp : this.#calcMd5Resp;
        const response = calcResp(challenge, password);

        const { data, status } = await this.post(this.routes.login, { 
            username, response
        });

        if (status === 200) {
            const sessionId = this.#getXmlElementValue(data, 'SID');

            return sessionId;
        }
    }

    /**
     * Calculates the response for a given challenge via PBKDF2 algorithm.
     * 
     * @param {string} challenge String with current challenge of device.
     * @param {string} password String with password of device.
     * @returns Returns binary value in hexadecimal notation.
     */
    #calcPbkdf2Resp(challenge, pwd) {
        const [_, iter1, salt1, iter2, salt2] = challenge.split('$');

        const calcHash = (value, salt, iter) =>
            pbkdf2Sync(value, Buffer.from(salt, 'hex'), parseInt(iter), 32, 'sha256');

        const hash1 = calcHash(pwd, salt1, iter1);
        const hash2 = calcHash(hash1, salt2, iter2);

        return salt2 + '$' + hash2.toString('hex');
    }

    /**
     * Calculates the response for a given challenge via MD5 algorithm.
     * 
     * @param {string} challenge String with current challenge of device.
     * @param {string} password String with password of device.
     * @returns Returns binary value in hexadecimal notation.
     */
    #calcMd5Resp = (challenge, pwd) =>
        challenge + '-' + createHash('md5')
            .update(Buffer.from(challenge + '-' + pwd, 'utf-16le')).digest('hex');

    /**
     * Validates given session identifier.
     * 
     * @param {string} sid String with session identifier. 
     * @returns Returns whether session identifier is valid.
     */
    #isValidSid = (sid) => sid && (!this.reqDate 
        || new Date().getTime() - this.reqDate.getTime() < this.timeInMsTillLogout);

    /**
     * Gets string with XML attributes by keys and values of object.
     * 
     * @param {object} attrs Object with keys and values.
     * @returns Returns string with XML attributes.
     */
    #getXmlAttributes = (attrs) => attrs ? ` ${
        Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`).join(' ')}` : '';

    /**
     * Gets string value of XMLElement by name.
     * 
     * @param {string} data String with XML data.
     * @param {string} name String with name of the XMLElement.
     * @param {object} attrs Object with attributes of the XMLElement.
     * @returns Returns string with value of XMLElement.
     */
    #getXmlElementValue = (data, name, attrs) =>
        data?.match(`<${name}${this.#getXmlAttributes(attrs)}>(.*?)</${name}>`)?.[1];

    /**
     * Processes asynchronous operation and resolves after given time in milliseconds.
     * 
     * @param {number} ms Number with delay in milliseconds.
     * @returns Returns Promise object represents the eventual completion. 
     */
    #sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exports @see FritzBoxApi as default class.
 */
export default FritzBoxApi;

// Copyright (c) 2024, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import { stringify } from 'querystring';
import axios from 'axios';

/**
 * HttpClient is an abstract base class to handle HTTP request.
 */
class HttpClient {

    /**
     * Initializes new instance of @see HttpClient.
     * 
     * @param {string} baseUrl Base URL of device.
     */
    constructor(baseUrl) {
        if (baseUrl) {
            axios.defaults.baseURL = baseUrl;
        }
    }

    /**
     * Performs HTTP requests by passing configuration values
     * to related HTTP client.
     * 
     * @param {object} options Object with request configuration values.
     * @returns Object with response of HTTP client.
     */
    async request(options) {
        try {
            this.reqDate = new Date();

            return await axios(options);
        } catch {
            this.reqDate = null;

            return {};
        }
    }

    /**
     * Performs GET request by given URL.
     * 
     * @param {string} url Target URL of endpoint.
     * @returns Object with response of HTTP client.
     */
    get = async (url) => this.request({
        method: 'GET',
        url
    });

    /**
     * Performs POST request by given URL and data.
     * 
     * @param {string} url Target URL of endpoint.
     * @param {string} data Data to be sent as body to server.
     * @returns Object with response of HTTP client.
     */
    post = async (url, data) => this.request({
        method: 'POST',
        url,
        data: stringify(data)
    });
}

/**
 * Exports @see HttpClient as default class.
 */
export default HttpClient;

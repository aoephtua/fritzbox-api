// Copyright (c) 2024, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import FritzBoxApi, { url, login } from './config.mjs';

/**
 * Writes a message to the console.
 */
const log = console.log;

/**
 * Initializes new instance of @see FritzBoxApi and sets options.
 */
const fritzBoxApi = new FritzBoxApi({ url });

/**
 * Processes authentication by username and password.
 */
const isValidAuth = await login(fritzBoxApi);

/**
 * Validates authentication state before data fetching.
 */
if (isValidAuth) {
    /**
     * 1. Fetches data of default pid "overview".
     * 
     * const { 
     *     fritzos, comfort, lan, foncalls, net, 
     *     vpn, dect, fonnum, wlan, usb, internet, dsl 
     * } = result.data;
     */
    const result = await fritzBoxApi.getData();

    /**
     * 2. Fetches data of pid "netDev".
     * 
     * const {
     *     fbox, ipclient, isrepeater, bridgeMode,
     *     fbox_other, active
     * } = result.data;
     */
    //const result = await fritzBoxApi.getData({ page: 'netDev' });

    /**
     * 3. Fetches data of pid "wKey".
     * 
     * E.g. PSK (Pre-shared key): const { wlan: { psk } } = result.data;
     */
    //const result = await fritzBoxApi.getData({ page: 'wKey' });

    /**
     * 4. Fetches data of pid "log".
     * 
     * filter: 'all' (default), 'fon', 'net', 'usb', 'wlan', 'sys' 
     * 
     * const {
     *     show, log, filter, wlanGuestPushmail, wlan
     * } = result.data;
     */
    //const result = await fritzBoxApi.getData({ page: 'log', filter: 'all' });

    /**
     * Notice: Use DevTools to inspect network activities and get more page identifiers.
     */

    /**
     * Prints data of @see FritzBoxApi to stdout.
     */
    log(result);
}

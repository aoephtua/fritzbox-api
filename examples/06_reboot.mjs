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
 * Validates authentication state before rebooting.
 */
if (isValidAuth) {
    /**
     * Processes reboot of FRITZ!Box device.
     */
    const result = await fritzBoxApi.reboot();

    /**
     * Gets reboot state of FRITZ!Box device.
     */
    const rebootState = result?.reboot_state === 0 ? 'Success' : 'Failure';

    /**
     * Prints reboot state of @see FritzBoxApi to stdout.
     */
    log('Reboot State: ' + rebootState);
}

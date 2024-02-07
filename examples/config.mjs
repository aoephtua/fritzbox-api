// Copyright (c) 2024, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import FritzBoxApi from '../src/fritzBoxApi.mjs';

/**
 * Exports @see FritzBoxApi as default class.
 */
export default FritzBoxApi;

/**
 * Contains the URL related to FRITZ!Box device.
 */
const url = 'http://192.168.178.1';

/**
 * Contains the username related to the current user.
 */
const username = '';

/**
 * Contains the password related to the current user.
 */
const password = '';

/**
 * Processes authentication by username and password.
 * 
 * @param {FritzBoxApi} fritzBoxApi Instance of @see FritzBoxApi.
 * @returns Returns whether login succeeded.
 */
const login = async (fritzBoxApi) =>
    await fritzBoxApi.login(username, password);

/**
 * Exports configuration values and functions of FRITZ!Box API.
 */
export {
    url,
    username,
    password,
    login
};

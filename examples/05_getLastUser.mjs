// Copyright (c) 2024, Thorsten A. Weintz. All rights reserved.
// Licensed under the MIT license. See LICENSE in the project root for license information.

import FritzBoxApi, { url } from './config.mjs';

/**
 * Writes a message to the console.
 */
const log = console.log;

/**
 * Initializes new instance of @see FritzBoxApi and sets options.
 */
const fritzBoxApi = new FritzBoxApi({ url });

/**
 * Gets name of last user.
 */
const lastUser = await fritzBoxApi.getLastUser();

/**
 * Prints last user name of @see FritzBoxApi to stdout.
 */
log('Last User: ' + (lastUser || 'None'));

<h1 align="center">fritzbox-api</h1>

<p align="center">
    <em>Node.js library to control FRITZ!Box devices using JavaScript ES6.</em>
</p>

<p align="center">
    <a href="examples">Examples</a>
    ·
    <a href="src">Source</a>
    ·
    <a href="LICENSE">License</a>
</p>

<p align="center">
    <a href="https://github.com/aoephtua/fritzbox-api">
        <img src="https://img.shields.io/badge/js-ES6-blue" alt="js-es6" />
    </a>
    <a href="https://github.com/aoephtua/fritzbox-api/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg?label=license" alt="license" />
    </a>
    <a href="https://www.npmjs.com/package/fritzbox-api">
        <img src="https://img.shields.io/npm/v/fritzbox-api?label=npm" alt="npm" />
    </a>
    <a href="https://www.npmjs.com/package/fritzbox-api">
        <img src="https://img.shields.io/npm/dw/fritzbox-api?label=downloads" alt="downloads" />
    </a>
    <a href="https://github.com/aoephtua/fritzbox-api/commits/main">
        <img src="https://img.shields.io/github/last-commit/aoephtua/fritzbox-api" alt="commits">
    </a>
</p>

## Introduction

Straightforward, lightweight and extendable Node.js library to communicate with FRITZ!Box devices.

Full compatibility with PBKDF2 (from FRITZ!OS 7.24) for more secure authentication process is implemented. Backwards compatibility with MD5 is supported. The algorithm is automatically selected based on the version of the challenge.

Flexible data accessing by parameterizing data.lua endpoint. API can return JSON response for every single WebUI page.

## Installing

Using npm:

    $ npm install fritzbox-api

Once the package is installed, you can import the class:

```javascript
import FritzBoxApi from 'fritzbox-api';
```

## Usage

```javascript
const fritzBoxApi = new FritzBoxApi({ url: 'http://192.168.178.1' });

if (await fritzBoxApi.login('username', 'password')) {
    const data = await fritzBoxApi.getData({ page: 'overview' });
}
```

See [examples](examples) to get an insight.

## License

This project is licensed under [MIT](LICENSE).

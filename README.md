# fritzbox-api

[![npm](https://img.shields.io/npm/v/fritzbox-api)](https://www.npmjs.com/package/fritzbox-api)
![npm](https://img.shields.io/npm/dw/fritzbox-api?label=↓)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/aoephtua/fritzbox-api/blob/master/LICENSE)

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

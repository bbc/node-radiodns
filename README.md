[![Build Status](https://travis-ci.org/bbc/node-radiodns.svg?branch=master)](https://travis-ci.org/bbc/node-radiodns)


RadioDNS node.js Library
========================

## Summary

Perform [RadioDNS] resolutions and service lookups in [node.js].

RadioDNS was standardised in [ETSI TS 103 270],
_RadioDNS Hybrid Radio; Hybrid lookup for radio services_.


## Installation

    npm install --save radiodns


## Usage

Add this to the top of your script

    var radiodns = require('radiodns')

Then if you already have the Fully Qualified Domain Name as specified
in the RadioDNS spec ([ETSI TS 103 270]), you can resolve it into a CNAME like so

    radiodns.resolve('09580.c479.ce1.fm.radiodns.org', function(err, fqdn) {
      console.log(fqdn) // => rdns.musicradio.com
    })

Or lookup a bearerURI:

    radiodns.resolve('fm:ce1.c479.09580', function(err, fqdn) {
      console.log(fqdn) // => rdns.musicradio.com
    })

You can also pass in the parameters required to construct the FQDN to
the resolve method:

    var params = {
      system: 'fm',
      frequency: 95.8,
      pi: 'c479',
      ecc: 'e1'
    }

    radiodns.resolve(params, function(err, fqdn) {
      console.log(fqdn) // => rdns.musicradio.com
    })


To perform the next step and resolve the servers for a specific application:

    var params = {
      system: 'fm',
      frequency: 95.8,
      pi: 'c479',
      ecc: 'e1'
    }

    radiodns.resolveApplication(params, 'radiovis', function (err, result) {
      console.log(result)
    })

The `resolveApplication()` function will return an array of servers that serve this application.
This is the same as the result of a [dns.resolveSrv] query.

For example:

    [ { name: 'vis.musicradio.com',
        port: 61613,
        priority: 0,
        weight: 100 } ]



The broadcast systems `fm`, `dab`, `drm`, `amss` and `hd` are supported. 
The required parameters for each of these systems are:

* `fm`: FM with RDS/RBDS
  * `gcc`: The Global Country Code
  * `pi`: Received RDS/RBDS Programme Identification code
  * `frequency`: Frequency on which the service broadcast is received in Mhz
* `dab`: Digital Audio Broadcasting
  * `gcc`: The Global Country Code
  * `eid`: The Ensemble Identifier
  * `sid`: The Service Identifer
  * `scids`: The Service Component Identifier (defaults to 0)
  * `uatype`: The User Application Type (only for data components)
* `drm`: Digital Radio Mondiale
  * `sid`: The Service Identifer
  * `appdomain`: The application domain (only for data components)
  * `uatype`: The User Application Type (only for data components)
* `amss`: AM Signalling System
  * `sid`: The Service Identifer
* `hd`: IBOC
  * `tx`: Transmitter Identifier
  * `cc`: Country Code


## Country Resolution

For FM and DAB The library supports calculating the Global Country Code (gcc)
from Extended Country Code (ecc) - see the FM example at the top.

However it is common for FM broadcasts to lack RDS ECC, a field which would otherwise 
confirm the country of origin of the broadcast. Other information such as the physical 
location of the device could be used on its own, however that doesn't consider the 
scenario of being  on or close to a country border. This library enables the accurate 
resolution of the  country of origin by taking as inputs the RDS PI or DAB SID and 
the two-letter country  code of the physical location of the radio device 
(obtained, for example, using GPS).

    var params = {
      'system': 'fm',
      'isoCountryCode': 'GB',
      'pi': 'c204',
      'frequency': 96.00
    }

    radiodns.resolve(params, function(err, fqdn) {
      console.log(fqdn) // => radiodns.api.bbci.co.uk
    })

Passing in invalid parameters with throw an error.

For more information about country resolution, see the RadioDNS specification - 
[ETSI TS 103 270].


## Running Tests

    npm test

To generate a test coverage report:

    npm run coverage


## License

Copyright 2017 British Broadcasting Corporation

The RadioDNS library for node.js is free software; you can redistribute it and/or
modify it under the terms of the Apache License, Version 2.0.

The RadioDNS library for node.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE.  See the Apache License, Version 2.0 for
more details.




[node.js]:         https://nodejs.org/
[RadioDNS]:        https://en.wikipedia.org/wiki/RadioDNS
[dns.resolveSrv]:  https://nodejs.org/api/dns.html#dns_dns_resolvesrv_hostname_callback
[ETSI TS 103 270]: http://www.etsi.org/deliver/etsi_ts/103200_103299/103270/01.01.01_60/ts_103270v010101p.pdf

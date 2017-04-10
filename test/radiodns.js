'use strict'

var assert = require('assert')
var sinon = require('sinon')
var dns = require('dns')
var radiodns = require('../lib/radiodns')

describe('RadioDNS', function () {
  describe('constructFQDN', function () {
    describe('for FM/VHF system', function () {
      it('should construct a fqdn when frequency is supplied as a number', function () {
        var params = {
          'system': 'fm',
          'gcc': 'ce1',
          'pi': 'c585',
          'frequency': 95.8
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('09580.c585.ce1.fm.radiodns.org', fqdn)
      })

      it('should construct a fqdn when frequency is a string', function () {
        var params = {
          'system': 'fm',
          'gcc': 'ce1',
          'pi': 'c585',
          'frequency': '09580'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('09580.c585.ce1.fm.radiodns.org', fqdn)
      })

      it('should calculate a gcc if an ecc is given', function () {
        var params = {
          'system': 'fm',
          'ecc': 'e0',
          'pi': 'd1e0',
          'frequency': 103.9
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('10390.d1e0.de0.fm.radiodns.org', fqdn)
      })

      it('should calculate a gcc if an ISO country code is given', function () {
        var params = {
          'system': 'fm',
          'isoCountryCode': 'IE',
          'pi': 'c204',
          'frequency': 96.00
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('09600.c204.ce1.fm.radiodns.org', fqdn)
      })

      it('should throw if parameters are missing', function () {
        var params = {
          'system': 'fm',
          'frequency': '09580'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing parameter when constructing FM FQDN/
        )
      })
    })

    describe('for DAB system', function () {
      it('should construct a fqdn', function () {
        var params = {
          'system': 'dab',
          'gcc': 'ce1',
          'eid': 'c18c',
          'sid': 'cc86',
          'scids': '0'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('0.cc86.c18c.ce1.dab.radiodns.org', fqdn)
      })

      it('should construct a fqdn without a scids', function () {
        var params = {
          'system': 'dab',
          'gcc': 'ce1',
          'eid': 'c18c',
          'sid': 'cc86'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('0.cc86.c18c.ce1.dab.radiodns.org', fqdn)
      })

      it('should prepend uatype if provided', function () {
        var params = {
          'system': 'dab',
          'gcc': 'ce1',
          'eid': 'c185',
          'sid': 'e1c00098',
          'scids': 0,
          'uatype': '004'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('004.0.e1c00098.c185.ce1.dab.radiodns.org', fqdn)
      })

      it('should calculate a gcc if an ecc is given', function () {
        var params = {
          'system': 'dab',
          'ecc': 'e1',
          'eid': 'c18c',
          'sid': 'cc86'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('0.cc86.c18c.ce1.dab.radiodns.org', fqdn)
      })

      it('should calculate a gcc if an ISO country code is given', function () {
        var params = {
          'system': 'dab',
          'isoCountryCode': 'GB',
          'eid': 'c18c',
          'sid': 'cc86'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('0.cc86.c18c.ce1.dab.radiodns.org', fqdn)
      })

      it('should throw if parameters are missing', function () {
        var params = {
          'system': 'dab',
          'gcc': 'ce1'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing parameter when constructing DAB FQDN/
        )
      })
    })

    describe('for DRM system', function () {
      it('should construct a fqdn', function () {
        var params = {
          'system': 'drm',
          'sid': 'e1c238'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('e1c238.drm.radiodns.org', fqdn)
      })

      it('should throw if sid is missing', function () {
        var params = {
          'system': 'drm'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing parameter when constructing DRM FQDN/
        )
      })
    })

    describe('for AMSS system', function () {
      it('should construct a fqdn', function () {
        var params = {
          'system': 'amss',
          'sid': 'sid'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('sid.amss.radiodns.org', fqdn)
      })

      it('should throw if sid is missing', function () {
        var params = {
          'system': 'amss'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing parameter when constructing AMSS FQDN/
        )
      })
    })

    describe('for hd system', function () {
      it('should construct a fqdn', function () {
        var params = {
          'system': 'hd',
          'tx': 'tx',
          'cc': 'cc'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('tx.cc.hd.radiodns.org', fqdn)
      })

      it('should throw if tx or cc is missing', function () {
        var params = {
          'system': 'hd'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing parameter when constructing HD FQDN/
        )
      })
    })

    describe('for an unknown system', function () {
      it('should throw', function () {
        var params = {
          'system': 'njh'
        }
        assert.throws(
          function () {
            radiodns.constructFQDN(params)
          },
          /Missing system parameter when constructing FQDN/
        )
      })
    })

    describe('with alternate root domain', function () {
      before(function () {
        radiodns.setRootDomain('test.radiodns.org')
      })

      after(function () {
        radiodns.setRootDomain('radiodns.org')
      })

      describe('for FM/VHF system', function () {
        it('should construct a fqdn', function () {
          var params = {
            'system': 'fm',
            'gcc': 'ce1',
            'pi': 'c585',
            'frequency': '09580'
          }
          var fqdn = radiodns.constructFQDN(params)
          assert.equal('09580.c585.ce1.fm.test.radiodns.org', fqdn)
        })
      })
    })
  })

  describe('resolve', function () {
    var mock
    beforeEach(function () {
      mock = sinon.mock(dns)
      mock.expects('resolveCname').once().callsFake(function (hostname, callback) {
        callback(undefined, ['rdns.musicradio.com'])
      })
    })

    afterEach(function () {
      mock.restore()
    })

    it('should query radiodns.org', function (done) {
      radiodns.resolve('09580.c479.ce1.fm.radiodns.org', function (err, fqdn) {
        assert.equal(err, undefined)
        assert.equal(fqdn, 'rdns.musicradio.com')
        done()
      })
    })

    it('should accept object params too', function (done) {
      var params = {
        system: 'fm',
        frequency: 95.8,
        pi: 'c479',
        gcc: 'ce1'
      }
      radiodns.resolve(params, function (err, fqdn) {
        assert.equal(err, undefined)
        assert.equal(fqdn, 'rdns.musicradio.com')
        done()
      })
    })
  })

  describe('resolveApplication', function () {
    var mock
    beforeEach(function () {
      mock = sinon.mock(dns)
      mock.expects('resolveCname').once().callsFake(function (hostname, callback) {
        callback(undefined, ['rdns.musicradio.com'])
      })
      mock.expects('resolveSrv').once().callsFake(function (hostname, callback) {
        callback(undefined,
          [ {
            name: 'vis.musicradio.com',
            port: 61613,
            priority: 0,
            weight: 100 }
          ]
        )
      })
    })

    afterEach(function () {
      mock.restore()
    })

    it('should query radiodns.org', function (done) {
      radiodns.resolveApplication('09580.c479.ce1.fm.radiodns.org', 'radiovis', function (err, result) {
        assert.equal(err, undefined)
        assert.equal(result[0].name, 'vis.musicradio.com')
        assert.equal(result[0].port, 61613)
        done()
      })
    })

    it('should accept object params too', function (done) {
      var params = {
        system: 'fm',
        frequency: 95.8,
        pi: 'c479',
        gcc: 'ce1'
      }
      radiodns.resolveApplication(params, 'radiovis', function (err, result) {
        assert.equal(err, undefined)
        assert.equal(result[0].name, 'vis.musicradio.com')
        assert.equal(result[0].port, 61613)
        done()
      })
    })
  })
})

'use strict'

var assert = require('assert')
var RadioDNS = require('../lib/radiodns')

describe('RadioDNS', function () {

  describe('constructFQDN', function () {
    var radiodns
    beforeEach(function () {
      radiodns = new RadioDNS()
    })

    describe('for FM/VHF system', function () {
      it('should construct a fqdn when freq is supplied as a number', function () {
        var params = {
          'system': 'fm',
          'gcc': 'ce1',
          'pi': 'c585',
          'freq': 95.8
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('09580.c585.ce1.fm.radiodns.org', fqdn)
      })

      it('should construct a fqdn when freq is a string', function () {
        var params = {
          'system': 'fm',
          'gcc': 'ce1',
          'pi': 'c585',
          'freq': '09580'
        }
        var fqdn = radiodns.constructFQDN(params)
        assert.equal('09580.c585.ce1.fm.radiodns.org', fqdn)
      })

      it('should throw if parameters are missing', function () {
        var params = {
          'system': 'fm',
          'freq': '09580'
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
      var radiodns
      beforeEach(function () {
        radiodns = new RadioDNS('test.radiodns.org')
      })

      describe('for FM/VHF system', function () {
        it('should construct a fqdn', function () {
          var params = {
            'system': 'fm',
            'gcc': 'ce1',
            'pi': 'c585',
            'freq': '09580'
          }
          var fqdn = radiodns.constructFQDN(params)
          assert.equal('09580.c585.ce1.fm.test.radiodns.org', fqdn)
        })
      })
    })
  })

})

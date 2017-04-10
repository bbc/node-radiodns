'use strict'

var assert = require('assert')
var resolver = require('../lib/country-resolver')

describe('RadioDNS Country Resolver', function () {
  describe('given PI Code matches the Country Code', function () {
    describe('for CH + 4479', function () {
      it('should return one result of 4e1', function () {
        var params = {
          'isoCountryCode': 'CH',
          'rdsPi': '4479'
        }
        assert.deepEqual(['4e1'], resolver.resolveGCC(params))
      })
    })

    describe('for GB + C479', function () {
      it('should return one result of ce1', function () {
        var params = {
          'isoCountryCode': 'GB',
          'rdsPi': 'C479'
        }
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })

    describe('for AT + A479', function () {
      it('should return one result of ae0', function () {
        var params = {
          'isoCountryCode': 'AT',
          'rdsPi': 'A479'
        }
        assert.deepEqual(['ae0'], resolver.resolveGCC(params))
      })
    })
  })

  describe('given DAB SID Code matches the Country Code', function () {
    describe('for GB + C479', function () {
      it('should return one result of ce1', function () {
        var params = {
          'isoCountryCode': 'GB',
          'dabSid': 'C479'
        }
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })

    describe('for a 32-bit DAB Sid E1C00098', function () {
      it('should return one result of ce1', function () {
        var params = {
          'dabSid': 'E1C00098'
        }
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })
  })

  describe('given RDS PI Code matches an adjacent country', function () {
    describe('for CH + D479', function () {
      it('should return one result of de0', function () {
        var params = {
          'isoCountryCode': 'ch',
          'rdsPi': 'd479'
        }
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })

    describe('for GB + 2479', function () {
      it('should return one result of de0', function () {
        var params = {
          'isoCountryCode': 'GB',
          'rdsPi': '2479'
        }
        assert.deepEqual(['2e3'], resolver.resolveGCC(params))
      })
    })

    describe('for AT + 5479', function () {
      it('return two results of 5e0 & 5e2', function () {
        var params = {
          'isoCountryCode': 'AT',
          'rdsPi': '5479'
        }
        assert.deepEqual(['5e0', '5e2'], resolver.resolveGCC(params))
      })
    })
  })

  describe('given a RDS ECC', function () {
    describe('for E0 + D479', function () {
      it('should return one result of de0', function () {
        var params = {
          'ecc': 'E0',
          'rdsPi': 'D479'
        }
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })
  })

  describe('given a DAB ECC', function () {
    describe('for E0 + D479', function () {
      it('should return one result of de0', function () {
        var params = {
          'ecc': 'E0',
          'dabSid': 'D479'
        }
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })
  })
})

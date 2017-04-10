'use strict'

var assert = require('assert')
var resolver = require('../lib/country-resolver')

describe('RadioDNS Country Resolver', function () {
  describe('given PI Code matches the Country Code', function () {
    describe('for CH + 4479', function () {
      var params = {
        'isoCountryCode': 'CH',
        'rdsPi': '4479'
      }
      it('should return one result of 4e1', function () {
        assert.deepEqual(['4e1'], resolver.resolveGCC(params))
      })
    })

    describe('for GB + C479', function () {
      var params = {
        'isoCountryCode': 'GB',
        'rdsPi': 'C479'
      }
      it('should return one result of ce1', function () {
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })

    describe('for AT + A479', function () {
      var params = {
        'isoCountryCode': 'AT',
        'rdsPi': 'A479'
      }
      it('should return one result of ae0', function () {
        assert.deepEqual(['ae0'], resolver.resolveGCC(params))
      })
    })

    describe('with a country code and PI that don\'t resolve', function () {
      var params = {
        'isoCountryCode': 'CH',
        'rdsPi': 'B479'
      }
      it('should return an empty result set', function () {
        assert.deepEqual([], resolver.resolveGCC(params))
      })
    })

    describe('with no country code', function () {
      var params = {
        'rdsPi': 'A479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /ISO Country Code OR Extended Country Code \(ECC\) value must be set/
        )
      })
    })

    describe('with a RDS PI code that is too short', function () {
      var params = {
        'isoCountryCode': 'GB',
        'rdsPi': 'A'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid PI value. Value must be a valid hexadecimal string/
        )
      })
    })

    describe('with a RDS PI code that is too long', function () {
      var params = {
        'isoCountryCode': 'GB',
        'rdsPi': 'AAAAA'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid PI value. Value must be a valid hexadecimal string/
        )
      })
    })

    describe('with an illegal RDS PI code', function () {
      var params = {
        'isoCountryCode': 'GB',
        'rdsPi': 'XXXX'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid PI value. Value must be a valid hexadecimal string/
        )
      })
    })

    describe('with invalid country code', function () {
      var params = {
        'isoCountryCode': 'XX',
        'rdsPi': 'A479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /The supplied ISO Country Code is not recognised/
        )
      })
    })

    describe('with a three character country code', function () {
      var params = {
        'isoCountryCode': 'GBR',
        'rdsPi': 'C479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid country code. Must be an ISO 3166-1 alpha-2 country code/
        )
      })
    })
  })

  describe('given DAB SID Code matches the Country Code', function () {
    describe('for GB + C479', function () {
      var params = {
        'isoCountryCode': 'GB',
        'dabSid': 'C479'
      }
      it('should return one result of ce1', function () {
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })

    describe('for a 32-bit DAB Sid E1C00098', function () {
      var params = {
        'dabSid': 'E1C00098'
      }
      it('should return one result of ce1', function () {
        assert.deepEqual(['ce1'], resolver.resolveGCC(params))
      })
    })

    describe('with a DAB Sid code that is too short', function () {
      var params = {
        'isoCountryCode': 'GB',
        'dabSid': 'A'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid Service Identifier \(SId\) value. Must be a valid 4 or 8-character hexadecimal string/
        )
      })
    })

    describe('with a DAB Sid code that is too long', function () {
      var params = {
        'isoCountryCode': 'GB',
        'dabSid': 'AAAAA'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid Service Identifier \(SId\) value. Must be a valid 4 or 8-character hexadecimal string/
        )
      })
    })

    describe('with an illegal DAB Sid code', function () {
      var params = {
        'isoCountryCode': 'GB',
        'dabSid': 'XXXX'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid Service Identifier \(SId\) value. Must be a valid 4 or 8-character hexadecimal string/
        )
      })
    })

    describe('with invalid country code', function () {
      var params = {
        'isoCountryCode': 'XX',
        'dabSid': 'A479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /The supplied ISO Country Code is not recognised/
        )
      })
    })

    describe('with a three character country code', function () {
      var params = {
        'isoCountryCode': 'GBR',
        'dabSid': 'C479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Invalid country code. Must be an ISO 3166-1 alpha-2 country code/
        )
      })
    })

    describe('with a country code and DAB Sid that don\'t resolve', function () {
      var params = {
        'isoCountryCode': 'CH',
        'dabSid': 'B479'
      }
      it('should return an empty result set', function () {
        assert.deepEqual([], resolver.resolveGCC(params))
      })
    })
  })

  describe('given RDS PI Code matches an adjacent country', function () {
    describe('for CH + D479', function () {
      var params = {
        'isoCountryCode': 'ch',
        'rdsPi': 'd479'
      }
      it('should return one result of de0', function () {
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })

    describe('for GB + 2479', function () {
      var params = {
        'isoCountryCode': 'GB',
        'rdsPi': '2479'
      }
      it('should return one result of de0', function () {
        assert.deepEqual(['2e3'], resolver.resolveGCC(params))
      })
    })

    describe('for AT + 5479', function () {
      var params = {
        'isoCountryCode': 'AT',
        'rdsPi': '5479'
      }
      it('return two results of 5e0 & 5e2', function () {
        assert.deepEqual(['5e0', '5e2'], resolver.resolveGCC(params))
      })
    })
  })

  describe('given a RDS ECC', function () {
    describe('for E0 + D479', function () {
      var params = {
        'ecc': 'E0',
        'rdsPi': 'D479'
      }
      it('should return one result of de0', function () {
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })

    describe('with a PI that doesn\'t resolve', function () {
      var params = {
        'ecc': 'FF',
        'rdsPi': 'F479'
      }
      it('should return an empty result set', function () {
        assert.deepEqual([], resolver.resolveGCC(params))
      })
    })

    describe('for an invalid ECC code', function () {
      var params = {
        'ecc': 'XX',
        'rdsPi': 'D479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Value must be a valid hexadecimal Extended Country Code/
        )
      })
    })
  })

  describe('given a DAB ECC', function () {
    describe('for E0 + D479', function () {
      var params = {
        'ecc': 'E0',
        'dabSid': 'D479'
      }
      it('should return one result of de0', function () {
        assert.deepEqual(['de0'], resolver.resolveGCC(params))
      })
    })

    describe('with with Sid that doesn\'t resolve', function () {
      var params = {
        'ecc': 'FF',
        'dabSid': 'F479'
      }
      it('should return an empty result set', function () {
        assert.deepEqual([], resolver.resolveGCC(params))
      })
    })

    describe('for an invalid ECC code', function () {
      var params = {
        'ecc': 'XX',
        'dabSid': 'D479'
      }
      it('should throw an exception', function () {
        assert.throws(
          function () {
            resolver.resolveGCC(params)
          },
          /Value must be a valid hexadecimal Extended Country Code/
        )
      })
    })
  })

  describe('with no RDS PI or DAB SID', function () {
    var params = {
      'isoCountryCode': 'GB'
    }
    it('should throw an exception', function () {
      assert.throws(
        function () {
          resolver.resolveGCC(params)
        },
        /RDS Programme Identification \(rdsPi\) OR DAB Service Identifier \(dabSid\)/
      )
    })
  })
})

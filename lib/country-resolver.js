'use strict'

var countryData = require('../country-data.json')

function resolveGCC (params) {
  var broadcastCountryId
  if (params.pi) {
    if (params.pi.match(/^[0-9a-f]{4}$/i)) {
      broadcastCountryId = params.pi.substring(0, 1)
    } else {
      throw new Error(
        'Invalid PI value. Value must be a valid hexadecimal string RDS Programme Identification (PI) Code'
      )
    }
  } else if (params.sid) {
    if (params.sid.match(/^[0-9a-f]{4}$/i)) {
      broadcastCountryId = params.sid.substring(0, 1)
    } else if (params.sid.match(/^[0-9a-f]{8}$/i)) {
      broadcastCountryId = params.sid.substring(2, 3)
      params.ecc = params.sid.substring(0, 2)
    } else {
      throw new Error(
        'Invalid Service Identifier (SId) value. Must be a valid 4 or 8-character hexadecimal string'
      )
    }
  } else {
    throw new Error(
      'RDS Programme Identification (pi) OR DAB Service Identifier (sid) must be set'
    )
  }

    // construct and return a list of results
  if (params.isoCountryCode) {
    return resolveGCCWithCountryCode(params.isoCountryCode, broadcastCountryId)
  } else if (params.ecc) {
    return resolveGCCWithECC(params.ecc, broadcastCountryId)
  } else {
    throw new Error(
      'ISO Country Code (isoCountryCode) OR Extended Country Code (ecc) must be set'
    )
  }
}

function resolveGCCWithECC (ecc, broadcastCountryId) {
  if (!ecc || !ecc.match(/^[0-9a-f]{2}$/i)) {
    throw new Error(
      'Invalid ECC value. Value must be a valid hexadecimal Extended Country Code (ECC)'
    )
  }

  ecc = ecc.toLowerCase()
  broadcastCountryId = broadcastCountryId.toLowerCase()

  var country = countryData.find(function (country) {
    return country.ecc === ecc && country.countryIds.includes(broadcastCountryId)
  })
  if (!country) {
    return []
  }

  return [broadcastCountryId + ecc]
}

function resolveGCCWithCountryCode (isoCountryCode, broadcastCountryId) {
  if (!isoCountryCode || !isoCountryCode.match(/^[a-z]{2}$/i)) {
    throw new Error(
      'Invalid country code. Must be an ISO 3166-1 alpha-2 country code'
    )
  }

    // Lower case
  isoCountryCode = isoCountryCode.toLowerCase()

    // get the Country for the given ISO Country Code
  var reportedCountry = countryData.find(function (country) {
    return country.isoCountryCode === isoCountryCode
  })
  if (!reportedCountry) {
    throw new Error(
      'The supplied ISO Country Code is not recognised'
    )
  }

    // Lower case
  broadcastCountryId = broadcastCountryId.toLowerCase()

  var results = []
  if (reportedCountry.countryIds.includes(broadcastCountryId)) {
      // the country id of the received RDS PI Code matches the country id
      // of the reported location, return the ISO country code
    results.push(broadcastCountryId + reportedCountry.ecc)
  } else {
      // the country id & pi code do not match. Check countries adjacent
      // to the reported country to find a match (resolving
      // border-proximity issues)
    reportedCountry.nearbyCountries.forEach(function (nearby) {
      var countryParts = nearby.split(':')
      if (countryParts[0] === broadcastCountryId) {
          // an adjacent country matches, add to result list
        var nearbyCountry = countryData.find(function (country) {
          return country.isoCountryCode === countryParts[1]
        })
        results.push(countryParts[0] + nearbyCountry.ecc)
      }
    })
  }

  if (results.length === 0) {
    return []
  }

  return results
}

module.exports = {
  resolveGCC: resolveGCC,
  resolveGCCWithCountryCode: resolveGCCWithCountryCode,
  resolveGCCWithECC: resolveGCCWithECC
}

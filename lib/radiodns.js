'use strict'

var dns = require('dns')
var rootDomain = 'radiodns.org'

// From: http://stackoverflow.com/questions/1267283
function zeroFill (number, width) {
  width -= number.toString().length
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number
  }
  return number + '' // always return a string
}

// Format: <frequency>.<pi>.<gcc>.fm.radiodns.org
function constructFQDNforFM (params) {
  if (!params.frequency || !params.pi || !params.gcc) {
    throw new Error('Missing parameter when constructing FM FQDN')
  }

  if (typeof params.frequency === 'number') {
    params.frequency = zeroFill(params.frequency * 100, 5)
  }

  return [
    params.frequency,
    params.pi,
    params.gcc
  ]
}

// Format: [<uatype>.]<scids>.<sid>.<eid>.<gcc>.dab.radiodns.org
function constructFQDNforDAB (params) {
  if (!params.gcc || !params.eid || !params.sid) {
    throw new Error('Missing parameter when constructing DAB FQDN')
  }

  return [
    params.uatype,
    params.scids || '0',
    params.sid,
    params.eid,
    params.gcc
  ]
}

// Format: [<uatype>.<appdomain>]<sid>.drm.radiodns.org
function constructFQDNforDRM (params) {
  if (!params.sid) {
    throw new Error('Missing parameter when constructing DRM FQDN')
  }

  return [
    params.uatype,
    params.appdomain,
    params.sid
  ]
}

// Format: <sid>.amss.radiodns.org
function constructFQDNforAMSS (params) {
  if (!params.sid) {
    throw new Error('Missing parameter when constructing AMSS FQDN')
  }

  return [
    params.sid
  ]
}

// Format: <tx>.<cc>.hd.radiodns.org
function constructFQDNforHD (params) {
  if (!params.tx || !params.cc) {
    throw new Error('Missing parameter when constructing HD FQDN')
  }

  return [
    params.tx,
    params.cc
  ]
}

function constructFQDN (params) {
  var components

  switch (params.system) {
    case 'fm':
      components = constructFQDNforFM(params)
      break

    case 'dab':
      components = constructFQDNforDAB(params)
      break

    case 'drm':
      components = constructFQDNforDRM(params)
      break

    case 'amss':
      components = constructFQDNforAMSS(params)
      break

    case 'hd':
      components = constructFQDNforHD(params)
      break

    default:
      throw new Error('Missing system parameter when constructing FQDN')
  }

  // Append the system and the root domain
  components.push(params.system, rootDomain)

  // Remove empty elements and convert to string
  return components.filter(function (component) {
    return component !== undefined
  }).join('.')
}

function resolve (params, callback) {
  if (typeof params === 'object') {
    params = constructFQDN(params)
  } else if (typeof params === 'string' && params.match(/^(\w+\.)+[^.]+$/)) {
    // Looks like a FQDN, do nothing
  } else if (typeof params === 'string' && params.match(/^(\w+\/)+[^/]+$/)) {
    // Looks like a ServiceIdentifier
    params = params.split('/').reverse().join('.') + '.' + rootDomain
  } else if (typeof params === 'string' && params.match(/^(\w+):([\w.]+)$/)) {
    // Looks like a bearerURI
    params = params.split(/[:.]/).reverse().join('.') + '.' + rootDomain
  } else {
    throw new Error('Unsupported argument passed to radiodns.resolve()')
  }

  dns.resolveCname(params, function (err, addresses) {
    if (err) {
      callback(err)
    } else {
      callback(undefined, addresses[0])
    }
  })
}

function resolveApplication (params, app, callback) {
  resolve(params, function (err, fqdn) {
    if (err) {
      callback(err)
    } else {
      var query = '_' + app + '._tcp.' + fqdn
      dns.resolveSrv(query, callback)
    }
  })
}

function setRootDomain (domain) {
  rootDomain = domain
}

module.exports = {
  resolve: resolve,
  resolveApplication: resolveApplication,
  constructFQDN: constructFQDN,
  setRootDomain: setRootDomain
}

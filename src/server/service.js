const express = require('express'),
      service = express(),
      ServiceRegistry = require('./serviceRegistry'),
      serviceRegistry = new ServiceRegistry()

service.set('serviceRegistry', serviceRegistry)

service.get('/service/:intent/:port', (req, res, next) => {
  const {intent, port} = req.params

  // this assumes requests are not routed through proxy servers and can be reached directly
  const serviceIp = req.connection.remoteAddress.includes('::')
    ? `[${req.connection.remoteAddress}]` // IPV6
    : req.connection.remoteAddress // IPV4

  serviceRegistry.add(intent, serviceIp, port)
  res.json({result: `${intent} at ${serviceIp}:${port}`})
})

module.exports = service

const http = require('http'),
      service = require('../server/service'),
      server = http.createServer(service),
      serviceRegistry = service.get('serviceRegistry')
      slackClient = require('../server/slackClient'),
      slackLogLevel = 'verbose',
      slackToken = 'xoxb-296518630960-FcMWYiMkPtcBC2pF9dAzisLe', // TODO: don't commit this
      witClient = require('../server/witClient')('3YLRIBPQM6WDAH2BGPPK4SBCA662YMY4'), // call with wit token
      rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry) // coalesce slack configs here

rtm.start() // start our RTM server that we're returning from the fxn above
slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000)) // don't start express until we've authenticated w Slack

server.on('listening', () => {
  console.log(`Your rad ${service.get('env')} Slack bot is is listening on ${server.address().port}.`)
})
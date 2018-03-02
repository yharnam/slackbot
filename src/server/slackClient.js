const {CLIENT_EVENTS, RTM_EVENTS, RtmClient} = require('@slack/client')

// module globals for access in handlers & initialization
let rtm,
    nlp,
    registry


function handleOnMessage(message) {
  console.log(message)

  if (message.text.toLowerCase().includes('hi tops')) {


    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.error(err)
        return
      }

      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value)
          throw new Error('Could not extract intent.')

        const intent = require('./intents/' + res.intent[0].value)

        intent.process(res, registry, function(err, res) {
          if(err) {
            console.error(err.message)
            return rtm.sendMessage(err.message, message.channel)
          }

          return rtm.sendMessage(res, message.channel)
        })
      } catch(err) {
        console.error(err, res)
        return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel)
      }
    })
  }
}


/**
 * This function provides a hook into post-authentication in Slack
 * @param rtm - our RTM server instance
 * @param {function} handler - runs after the app authenticates against Slack
 */
function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler)
}


function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
}


/*
  This initializing fxn to sets up our Slack obj to be used by other modules

  That way, we don't instantly connect to Slack on require and we can
  break this out in case we want to modify or test it before connecting
  */
module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
  rtm = new RtmClient(token, {logLevel})
  nlp = nlpClient
  registry = serviceRegistry
  addAuthenticatedHandler(rtm, handleOnAuthenticated)
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage)
  return rtm
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler

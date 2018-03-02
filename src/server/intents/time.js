const request = require('superagent')

module.exports.process = function process(intentData, registry, cb) {

  // ensure we've the requisite intent inputs
  if(intentData.intent[0].value !== 'time') return cb(new Error(`Expected time intent, got ${value}`))
  if(!intentData.location) return cb(new Error(`Missing location in time intent`))

  const location = intentData.location[0].value,
        service = registry.get('time')

  if(!service) return cb(false, `No service available`)

  request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
    if(err || res.status !== 200 || !res.body.result) {
      console.error(err)
      return cb(false, `I could not figure out the time in ${location}`)
    }

    return cb(false, `It is currently ${res.body.result} in ${location}.`)
  })
}
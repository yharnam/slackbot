// This class tracks all services and provides methods to add and remove them.

class ServiceRegistry {
  constructor() {
    this._services = []
    this._timeout = 30
  }

  add(intent, ip, port) {
    const key = intent+ip+port // unique identifier for a given endpoint

    if(!this._services[key]) {
      this._services[key] = {
        intent,
        ip,
        port,
        timestamp: Math.floor(new Date() / 1000) // UNIX timestamp in ms

      }

      console.log(`added service for ${intent} on ${ip}:${port}`)
      this._cleanup()
      return
    }

    this._services[key].timestamp = Math.floor(new Date() / 1000)
    console.log(`Updated service for ${intent} on ${ip}:${port}`)
    this._cleanup()

  }

  remove(intent, ip, port) {
    const key = intent+ip+port
    delete this._services[key]
  }

  get(intent) {
    this._cleanup()
    for(let key in this._services) {
      // if we wanted to add load balancing for our services we'd do it here
      if(this._services[key].intent === intent) return this._services[key]
    }
    return null
  }

  _cleanup() {
    const now = Math.floor(new Date() / 1000)
    for(let key in this._services) {
      if(this._services[key].timestamp + this._timeout < now) {
        console.log(`Removed service for ${this._services[key].intent}`)
        delete this._services[key]
      }
    }
  }
}

module.exports = ServiceRegistry

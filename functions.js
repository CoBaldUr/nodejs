let bonjour = require('bonjour')()


function discovery(){
    return  browser = bonjour.find({type: 'http'}, function (service) {
        console.log('Found an HTTP server:', service)
        console.log(service.referer.address+":"+service.port+" "+service.name)
    })


}


module.exports = {
    discovery : discovery
}
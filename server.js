
let bonjour = require('bonjour')()

let f = require('./functions')
let io = require('socket.io')(3000)

const users = {}
const services = {}


bonjour.publish({ name: 'Base', type: 'http', port: 3000 })
bonjour.find({type: 'http'}, function (service) {
    console.log("Boot WO log")
    //console.log('Found an HTTP server:', service)
    services[service.name]=service
    //console.log('Found service:', services[service.name])
    io.sockets.emit('service-connected', services[service.name])

})

console.log("boot")




io.on('connection', socket => {
    console.log("log")
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)

        bonjour.publish({ name: name, type: 'http', port: 3000 })
        console.log("publish", services)
        socket.emit('servicesMulti-connected', services)
    })


    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })


    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })



})



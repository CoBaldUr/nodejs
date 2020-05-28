
let bonjour = require('bonjour')()

let f = require('./functions')
let io = require('socket.io')(3000)

const users = {}
const servicesLocal = {}
const servicesDeLocal ={}


servicesLocal["Base"]=bonjour.publish({ name: 'Base', type: 'http', port: 3000 })
bonjour.find({type: 'http'}, function (service) {
    console.log("Boot WO log")
    //console.log('Found an HTTP server:', service)
    //servicesLocal[service.name]=service
    console.log("service name : "+service.name)
    if (servicesLocal[service.name]== undefined){
        console.log("Delocal")
        servicesDeLocal[service.name]=service
        io.sockets.emit('service-connected', { service :servicesDeLocal[service.name], type : "Delocal"})
    }
else{
        io.sockets.emit('service-connected', { service : servicesLocal[service.name], type : "Local"})
    }

/*
    for (var att in service){
        console.log("Foo has property " + att);
    }
*/
})

console.log("boot")




io.on('connection', socket => {
    console.log("log")
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)

        let service =bonjour.publish({ name: name, type: 'http', port: 3000 })

        socket.emit('servicesMulti-connected', { services : servicesLocal, type : "Local"})
        servicesLocal[service.name]=service

        //console.log("publish", servicesLocal)

        socket.emit('servicesMulti-connected', { services : servicesDeLocal, type : "DeLocal"})
    })


    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })


    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        let name = users[socket.id]
        delete users[socket.id]
        let service = servicesLocal[name]
        console.log(name ,service)
        var stop =service.stop
        stop()
        delete  servicesLocal[name]
        //socket.broadcast.emit('service-disconnected', users[socket.id])

    })


})

///  test publication du html
var express = require('express');
var app = express();
var path = require("path");

app.use( express.static( __dirname + '/client' ));
app.get( '/', function( req, res ) {
        res.sendFile( path.join( __dirname, 'client', 'index.html' ));
    });


app.listen(8080)
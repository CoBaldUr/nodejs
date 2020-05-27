
const socket = io('http://192.168.0.101:3000')
const messageContainer = document.getElementById('message-container')
const serviceContainer = document.getElementById('service-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
})

socket.on('service-connected', service => {
    console.log("service")
    appendService(service)
})

socket.on('servicesMulti-connected', services => {
    console.log("services")
    appendServicesMulti(services )
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})






function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

function appendService(service) {
    console.log("service", service)
    const name = service["name"]
    const serviceElement = document.createElement('div')
    serviceElement.innerText = name
    serviceContainer.append(name)
}

function appendServicesMulti(services) {

    for (const id in services){
        console.log("services", services[id])
   appendService(services[id])

    }

    }
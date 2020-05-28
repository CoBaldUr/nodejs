
const socket = io('http://192.168.0.101:3000')
const messageContainer = document.getElementById('message-container')
const formContainer = document.getElementById('send-container')
const serviceLocalContainer = document.getElementById('serviceLocal-container')
const serviceDeLocalContainer = document.getElementById('serviceDeLocal-container')
const messageForm = document.getElementById('send-container')


const name = prompt('What is your name?')
appendMessage('You joined')
appendForm()
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

socket.on('service-connected', data => {
    //console.log("service "+data)
    appendService(data.service, data.type)
})

socket.on('servicesMulti-connected', data => {
    console.log("services")
    appendServicesMulti(data.services, data.type )
})








function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

function appendService(service, type) {
    console.log("service", service)
    console.log("type", type)
    const name = service["name"]
    const serviceElement = document.createElement('a')
    serviceElement.innerText = name
    if (type=="Local"){
    serviceLocalContainer.append(serviceElement)
    }
    else serviceDeLocalContainer.append(serviceElement)
}

function appendServicesMulti(services, type) {

    for (const id in services){
        console.log("services", services[id])
   appendService(services[id], type)

    }

    }



    function appendForm() {
    const inputForm =document.createElement('input')
        inputForm.setAttribute("type","text")
        inputForm.setAttribute("id","message-input")

        formContainer.append(inputForm)

        const buttonForm = document.createElement("BUTTON")
        buttonForm.setAttribute("type","submit")
        buttonForm.setAttribute("id","send-button")
        buttonForm.innerText ="Envoyer"

        formContainer.append(buttonForm)

        const messageInput = document.getElementById('message-input')
        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            appendMessage(`You: ${message}`)
            socket.emit('send-chat-message', message)
            messageInput.value = ''
        })

    }
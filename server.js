let express = require('express')
let bonjour = require('bonjour')()
let app = express()
var bodyParser = require('body-parser')
let f = require('./functions')


app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
bonjour.publish({ name: "Base", type: 'http', port: 8080 })

app.get('/', async (request, response) => {



    response.render('pages/index', {})



})

app.get('/service', (request, response) => {
    response.send('Services :')
    bonjour.destroy()
})
app.post('/', (request, response) => {
    // POST
    var name = "null"
    name = request.body.namePeer


    // !!!!!!!! Gerer les doublons
    try{
    bonjour.publish({ name: name, type: 'http', port: 8080 })
    }catch (error) {
        console.log('Error',error)
    }



let browser = null
    browser= f.discovery()
    browser.start()
if (browser!=null){
    ////// !!!!!!!!!!!!!! event au lieu d'attendre

    setTimeout( () =>{
        //browser.stop()
        let services = browser.services
        bonjour.publish({ name: name+"bis", type: 'http', port: 8080 })
        rendu(response, services)}, 3000);
}



})


function rendu(response,services){
    response.render('pages/connection', {peersArr : services})



    console.log("test")
    for (let peer in services){
        console.log('for :', services[peer].referer.address+":"+services[peer].port+" "+services[peer].name)
    }
    console.log("test2")

}


app.listen(8080)
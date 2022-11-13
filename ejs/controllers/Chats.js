const {promises: fs} = require ('fs')
const moment = require('moment')

class Chats {
    constructor(route) {
        this.route = route
    }
    async getAllChats() {
        try {
            const content = JSON.parse(await fs.readFile(`./chats.json`,'utf-8'))
            return content
        } catch (error) {
            return []
        }
    }
    async saveChats(data){
        try{
            const newMessage = {
                email: data.email,
                textoMensaje: data.textoMensaje,
                date: moment().format('L LTS')
            }
            const loadedMessage = await this.getAllChats()
            loadedMessage.push(newMessage)
            await fs.writeFile(`./chats.json`, JSON.stringify(loadedMessage ,null, 2))
            return loadedMessage
        }catch(e){
            throw new Error(e.message)
            }
        }
}

module.exports = Chats
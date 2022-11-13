const {promises: fs} = require ('fs')

class Contenedor {
    constructor(route) {
        this.route = route
    }
    async getAll() {
        try {
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8')) // que paso con this.route
            return content
        } catch (error) {
            return []
        }
    }
    async getById(id){
        try {
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8'))
            const elementosFiltrados = content.filter(e => e.id === (parseInt(id)))
            if(elementosFiltrados.length === 0){
                return({ error : 'producto no encontrado' })
            } else {
                return(elementosFiltrados)
            }
        } catch (error) {
            res.send(error)
            null
        }
    }
    async save(title, price, thumbnail) {
        try {
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8'))
            let newId;
            if(content.length == 0){
                newId = 1;
            }else {
                newId = content[content.length - 1].id + 1;
            }
            const newObj = {
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: newId
            }
            content.push(newObj);
            await fs.writeFile(`./productos.json`,JSON.stringify(content, null, 2))
            return(newObj)
        } catch (error) {
            return(error)
        }
    }

    async update(title, price, thumbnail,id) {
        try{
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8'))
            let identificacion = Number(id)
            let index = content.findIndex(prod => prod.id === identificacion)
            const newProduct = {title, price, thumbnail, "id": identificacion};
            if(index === -1 ) {
                res.send({ error : 'producto no encontrado' }
                ) 
            } else {
                content[index] = newProduct
            }
            await fs.writeFile(`./productos.json`,JSON.stringify(content, null, 2))
            return(content);
        } catch (error) {
            return(error)
        }
    }
    async deleteAll(){
        try {
            await fs.writeFile(`./$productos.json`,JSON.stringify([], null, 2))
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8'))
            console.log(content)
        } catch (error) {
            console.log(error)
            return "no pudo eliminarse"
        }
    }
    async deleteById (id) {
        try {
            const content = JSON.parse(await fs.readFile(`./productos.json`,'utf-8'))
            const elementosFiltrados = content.filter(e => e.id !== parseInt(id))
            if(elementosFiltrados.length === (content.length)){
                return({ error : 'producto no encontrado' })
            } else {
                await fs.writeFile(`./productos.json`,JSON.stringify(elementosFiltrados, null, 2))
                return(elementosFiltrados)
            }
        } catch (error) {
            return(error)
        }
    }
}

module.exports = Contenedor
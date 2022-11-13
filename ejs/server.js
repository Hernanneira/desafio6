const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const Contenedor = require('./controllers/Contenedor')
const ProductoController = new Contenedor('productos.json')
const Chats = require('./controllers/Chats')
const historial = new Chats('chats.json')
const app = express()

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.set('view engine', 'ejs')
app.set('views', './public/views');

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//webSocket
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');

    //productos
    socket.emit("productos", await ProductoController.getAll())
    socket.on("guardarNuevoProducto", (nuevoProducto) => {

        ProductoController.save(nuevoProducto)
        io.sockets.emit("productos", ProductoController.getAll)
    })

//mensajes

    const messages = await historial.getAllChats()
    socket.emit('messages', messages);

    socket.on('messegesNew', async (data) => {
    const historialSave = await historial.saveChats(data)
        io.sockets.emit('messages', historialSave);
    });
});

//CRUD
app.get('/', async (req, res, next) =>{
    const productos = await ProductoController.getAll()
    res.render('pages/index',{productos})
})

app.get('/:id', async (req,res,next) => {
    const { id } = req.params
    const productos = await ProductoController.getById(id)
    res.render('pages/index',{productos})
})

app.post('/', async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const newProducto = await ProductoController.save(title, price, thumbnail)
    console.log(newProducto)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

app.put('/:id',async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const { id } = req.params;
    const upDateProducto = await ProductoController.update(title, price, thumbnail,id)
    console.log(upDateProducto)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

app.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const deleteProducto = await ProductoController.deleteById(id)
    console.log(deleteProducto)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

//Server
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

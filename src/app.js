import express from 'express';
import mongoose from 'mongoose';
import { db } from './config/database.js';
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import homeRouter from './routes/home.router.js'
import realTimeRouter from './routes/realtimeproducts.router.js';
import { productsRouter } from './routes/products.router.js';
import productManager from './dao/db/ProductManager.js';
import messageModel from './dao/models/message.model.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import sessionFileStore from 'session-file-store';
import sessionRouter from './routes/session.router.js';
import pkg from 'session-file-store';
import publicRoutesMiddleware from './middleware/publicRoutesMiddleware.js'
import privateRoutesMiddleware from './middleware/privateRoutesMiddleware.js'
import path from 'path';
import usersRouter from './routes/users.routes.js'
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const { FileStore } = pkg;

const app = express();
const MongoStore = sessionFileStore(session);

const port = 8080;
const httpServer = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);
initializePassport();
app.use(session({
    secret: 'secret-key1234',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection, path: 'sessions' }), 
    cookie: { maxAge: 60 * 60 * 1000 } 
}));
app.use(passport.initialize())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.use('/api/products', productsRouter);
app.use('/', homeRouter );
app.use(cookieParser());
app.use('/realtimeproducts', realTimeRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use('/api/sessions', sessionRouter); 
app.use('/api/users', usersRouter)

app.get('/register', publicRoutesMiddleware, (req, res) => {
    res.render('register');
});

app.get('/login', publicRoutesMiddleware, (req, res) => {
    res.render('login'); 
});

app.get('/profile', privateRoutesMiddleware, (req, res) => {
    const user = req.session.user;
    console.log("Datos del usuario conectado:", user);

    if (user) {
        let isAdmin = false;
        if (user.rol === 'admin') {
            isAdmin = true;
        }
        res.render('profile', { user: user, isAdmin: isAdmin });
    } else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/profile');
        }
        res.redirect('/login');
    });
});

io.on('connection', async (socket) => {
        console.log('Cliente conectado');
        const products = await productManager.getProducts();
        socket.emit('products', products);
        socket.on('addProduct', async (data) => {
            try {
                const newProduct = await productManager.addProduct(data);
                
                const updateProducts = await productManager.getProducts();
                io.emit('products', updateProducts);
                
                return newProduct; // Devuelve el producto agregado
            } catch (error) {
                console.log(error.message);
            }
        });
    socket.on('deleteProduct', async (data) => {
        try {
            const idDeleted = await productManager.deleteProduct(data);
            const updateProducts = await productManager.getProducts();
            io.emit('products', updateProducts);
            console.log(idDeleted);
            io.emit('idDeleted', idDeleted);
        }
        catch (err) {
            console.log('Error: ', err)
        }
    });
    const messages = await messageModel.find();
    socket.emit('messages', messages);
    socket.on('newMessage', async (data) => {
        try {
            const newMessage = new messageModel(data);
            await newMessage.save();
            const messages = await messageModel.find();
            socket.emit('messages', messages);
        }
        catch (err) {
            console.log('Error: ', err)
        }
    })
});

export default io;

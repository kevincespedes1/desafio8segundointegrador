import express from 'express';
import productManager from '../dao/fs/ProductManager.js';
import { UserController } from '../controllers/user.controller.mdb.js'

const homeRouter = express.Router();
const userController = new UserController()

homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const home = 'home';
        const user = req.session.user;

        res.render('index', { home, products, user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
homeRouter.get('/users', async (req, res) => {
    if (req.session.user && req.session.user.rol === 'admin') {
        const data = await userController.getUsersPaginated(req.query.page || 1, req.query.limit || 50)
        data.pages = []
        for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

        res.render('users', {
            title: 'Listado de USUARIOS',
            data: data
        })
    } else if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.redirect('/login')
    }
})

export default homeRouter;
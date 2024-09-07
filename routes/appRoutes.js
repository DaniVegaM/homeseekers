import express from 'express';
import {startPage, categories, notFound, searchEngine} from '../controllers/appController.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

//Pagina de inicio
router.get('/', identificarUsuario, startPage);

//Categorias
router.get('/categories/:id', identificarUsuario, categories);

//Pagina 404
router.get('/404', identificarUsuario, notFound);

//Buscador
router.post('/searchEngine', identificarUsuario, searchEngine);

export default router;


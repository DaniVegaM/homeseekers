import express from 'express';
import {startPage, categories, notFound, searchEngine} from '../controllers/appController.js';

const router = express.Router();

//Pagina de inicio
router.get('/', startPage);

//Categorias
router.get('/categories/:id', categories);

//Pagina 404
router.get('/404', notFound);

//Buscador
router.post('/searchEngine', searchEngine);

export default router;


import express from 'express';
import {body} from 'express-validator'; //body solo se ocupa cuando validas desde el router
import {admin, create, save} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';

const router = express.Router();

router.get('/my-properties', protegerRuta, admin);
router.get('/my-properties/create', protegerRuta,create);
router.post('/my-properties/create', protegerRuta,
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'), 
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria')
                        .isLength({max: 200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage("Selecciona una categoría"), 
    body('precio').isNumeric().withMessage("Selecciona un rango de precios"), 
    body('habitaciones').isNumeric().withMessage("Selecciona la cantidad de habitaciones"), 
    body('estacionamiento').isNumeric().withMessage("Selecciona la cantidad de estacionamientos"), 
    body('wc').isNumeric().withMessage("Selecciona la cantidad de baños"),
    body('lat').notEmpty().withMessage("Ubica la propiedad en el mapa"),
    save);


export default router;

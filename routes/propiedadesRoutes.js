import express from 'express';
import {body} from 'express-validator'; //body solo se ocupa cuando validas desde el router
import {admin, create, save, addImage, saveImage, edit, saveUpdate, deletee, changeState, showProperty, sendMessage, viewMessages} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import identificarUsuario from '../middleware/identificarUsuario.js';
import upload from '../middleware/subirImagen.js';

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
    save
);

router.get('/my-properties/add-image/:id', protegerRuta, addImage);
router.post('/my-properties/add-image/:id',protegerRuta ,upload.single('imagen'), saveImage);

router.get('/my-properties/edit/:id', protegerRuta, edit);
router.post('/my-properties/edit/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'), 
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria')
                        .isLength({max: 200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage("Selecciona una categoría"), 
    body('precio').isNumeric().withMessage("Selecciona un rango de precios"), 
    body('habitaciones').isNumeric().withMessage("Selecciona la cantidad de habitaciones"), 
    body('estacionamiento').isNumeric().withMessage("Selecciona la cantidad de estacionamientos"), 
    body('wc').isNumeric().withMessage("Selecciona la cantidad de baños"),
    body('lat').notEmpty().withMessage("Ubica la propiedad en el mapa"),
    saveUpdate
);

router.post('/my-properties/delete/:id', protegerRuta, deletee)
/*NOTA: El forms solo soporta get y post, pero en este caso como se hará desde un JS por eso si usaré "PUT"*/
router.put('/my-properties/:id', protegerRuta, changeState)


//Area publica
router.get('/property/:id', identificarUsuario ,showProperty);

//Almacenar los mensajes
router.post('/property/:id', identificarUsuario, body('mensaje').isLength({min:10}).withMessage('El mensaje es muy corto'), sendMessage);

router.get('/messages/:id', protegerRuta, viewMessages)

export default router;

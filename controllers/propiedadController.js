import {Precio, Categoria, Propiedad} from '../models/index.js'
import {validationResult} from 'express-validator';

const admin = (req, res) => {
    // console.log(obtenerUsuarioDeToken(req.cookies._token))
    /*NOTA: Falta crear una funcion para comprobar el JWT y ver que siga firmado y todo para validar*/
    res.render('properties/admin', {
        pagina: 'Mis propiedades',
        barra: true
    });
}

//Formulario para crear una nueva propiedad
const create = async(req, res) => {
    //Consultar modelo de precio y categoria para pasarlo a la vista
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('properties/create', {
        pagina: 'Crear Propiedad',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
}

const save = async (req, res) => {
    //Resultado de la validacion
    let resultado = validationResult(req);

    if(!resultado.isEmpty()){

        //Consultar modelo de precio y categoria para pasarlo a la vista
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        //Pasamos errores a la vista
        return res.render('properties/create', {
            pagina: 'Crear Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Crear un registro y guardar propiedad en BD
    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body;

    const {id:usuarioId} = req.usuario;

    try {
        const propiedadGuardada = await Propiedad.create({
        titulo,
        descripcion,
        habitaciones,
        estacionamiento,
        wc,
        calle,
        lat,
        lng,
        precioId,
        categoriaId,
        usuarioId,
        imagen: ''
        })

        const {id} = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
       console.log(error) 
    }
}

export{
    admin,
    create,
    save
}
import {Precio, Categoria, Propiedad} from '../models/index.js'
import {validationResult} from 'express-validator';

const admin = (req, res) => {
    // console.log(obtenerUsuarioDeToken(req.cookies._token))
    /*NOTA: Falta crear una funcion para comprobar el JWT y ver que siga firmado y todo para validar*/
    res.render('properties/admin', {
        pagina: 'Mis propiedades',
        nombre: req.usuario.nombre
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
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {},
        nombre: req.usuario.nombre
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
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body,
            nombre: req.usuario.nombre
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

        res.redirect(`/my-properties/add-image/${id}`);
    } catch (error) {
       console.log(error) 
    }
}

const addImage = async (req, res) => {
    //Validar que la propiedad exista
    const {id} = req.params;

    //Validar que la propiedad no este publicada
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties');

    if(propiedad.publicado) // No se puede editar si esta publicada (activa)
        return res.redirect('/my-properties');
    
    //Validar que la propiedad pertenece a quien visita esta pagina
    //Seequelize y MySQL no tienen problema si los comparo directo sin convertir a String pero
    //otras bases de datos como Moongose o MongoDb sí dan problema entonces es mejor así
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString())
        return res.redirect('/my-properties');

    res.render('properties/addImage', {
        pagina: `Agregar Imagenes para: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const saveImage = async (req, res, next) => {
    console.log("SALVANDO IMAGEEEEEEEEEEEEN")
    //Validar que la propiedad exista
    const {id} = req.params;

    //Validar que la propiedad no este publicada
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties');

    if(propiedad.publicado) // No se puede editar si esta publicada (activa)
        return res.redirect('/my-properties');
    
    //Validar que la propiedad pertenece a quien visita esta pagina
    //Seequelize y MySQL no tienen problema si los comparo directo sin convertir a String pero
    //otras bases de datos como Moongose o MongoDb sí dan problema entonces es mejor así
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString())
        return res.redirect('/my-properties');

    try{
        //Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save(); //Almacena en la BD

        //Esta redirección no sirve ya porque se esta haciendo con js desde dropzone
        // res.redirect('/my-properties/')

        next();
    } catch(error){
        console.log(error);
    }
}

export{
    admin,
    create,
    save,
    addImage,
    saveImage
}
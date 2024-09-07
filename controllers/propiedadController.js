import {unlink} from 'node:fs/promises'
import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import {validationResult} from 'express-validator';
import {esVendedor, formatearFecha} from '../helpers/index.js'

const admin = async (req, res) => {

    //Leer QueryString (/pagina?page=1&order=desc)
    //Para agregar varios valores en el queryString ocupamos el &
    const {page} = req.query;
    console.log(page)

    const regex = /^[0-9]$/;
    if(!regex.test(page))
        return res.redirect('/my-properties?page=1');

    try {
        const {id} = req.usuario;

        //Limites y Offset para el paginador
        const limit = 10;
        const offset = ((page*limit) - limit); //El offset es como el número de registros que se va a saltar
        
        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit, //Este limit ya existe dentro de findAll
                offset, //Tambien este offset ya existe
                where:{usuarioId: id},
                //Esto cruza la información de las tablas y se trae la información que coincide
                //NOTA: Esto solo se puede si antes ya lo habíamos relacionado con un belongsTo o algo por el estilo
                include:[
                    {model: Categoria, as: 'categoria'},
                    {model: Precio, as: 'precio'},
                    {model: Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({
                where:{
                    usuarioId: id
                }
            })
        ])
        

    
        res.render('properties/admin', {
            pagina: 'Mis propiedades',
            csrfToken: req.csrfToken(),
            propiedades,
            nombre: req.usuario.nombre,
            //Es el numero de paginas que tendremos de acuerdo con el numero de propiedades que tiene el usuario
            paginas: Math.ceil(total / limit),
            page:Number(page), //Recuerda que es la pagina actual
            total,
            offset,
            limit
        });
    } catch (error) {
        console.log(error);
    }
    
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

const edit = async (req,res) => {

    const {id} = req.params;

    //Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties')

    //Revisar que quien visita la url es el mismo que creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
        return res.redirect('/my-properties')


    //Consultar modelo de precio y categoria para pasarlo a la vista
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('properties/edit', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad,
        nombre: req.usuario.nombre
    });
}

const saveUpdate = async (req,res) =>{
    //Verificar validación
    let resultado = validationResult(req);

    console.log(resultado)
    if(!resultado.isEmpty()){
        //Consultar modelo de precio y categoria para pasarlo a la vista
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        //Pasamos errores a la vista
        return res.render('properties/edit', {
            pagina: `Editar Propiedad`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body,
            nombre: req.usuario.nombre
        })
    }


    const {id} = req.params;

    //Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties')

    //Revisar que quien visita la url es el mismo que creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
        return res.redirect('/my-properties')

    //Reescribir el objeto y actualizarlo

    try{
        const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body;
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })
        await propiedad.save();

        res.redirect('my-properties');
    } catch(error){
        console.log(error);
    }
}

const deletee= async (req,res) =>{
    const {id} = req.params;

    //Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties')

    //Revisar que quien visita la url es el mismo que creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
        return res.redirect('/my-properties')

    //Eliminar la imagen de la propiedad
    await unlink(`public/uploads/${propiedad.imagen}`);
    console.log(`Se eliminó la imagen ${propiedad.imagen}`);


    //Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/my-properties');
}

//Modifica el estado de la propiedad
const changeState = async (req, res) => {
    const {id} = req.params;

    //Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id);

    if(!propiedad)
        return res.redirect('/my-properties')

    //Revisar que quien visita la url es el mismo que creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
        return res.redirect('/my-properties')

    //Actualizar
    propiedad.publicado = !propiedad.publicado;

    await propiedad.save();

    res.json({
        resultado: true
    })
}

//Muestra una propiedad

const showProperty = async(req,res) => {

    const {id} = req.params;
    //Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include:[
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    });
    if(!propiedad || !propiedad.publicado){
        return res.redirect('/404');
    }



    res.render('properties/show', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    });
}

const sendMessage = async (req, res) => {
    const {id} = req.params;
    //Comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include:[
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    });
    if(!propiedad){
        return res.redirect('/404');
    }

    //Renderizar los errores
    //Verificar validación
    let resultado = validationResult(req);

    console.log(resultado)
    if(!resultado.isEmpty()){
        return res.render('properties/show', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        });
    }

    const {mensaje} = req.body;
    const {id: propiedadId} = req.params;
    const {id: usuarioId} = req.usuario;

    //Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    //IDEA: Crear una cookie donde se almacene usuario y propiedad para que no se envien tantos mensajes
    //Y despues de cierto tiempo si no se contactan entonces se debe habilitar para enviar otro mensaje

    res.redirect('/');
    
}

//Leer mensajes recibidor
const viewMessages = async (req, res) =>{
    const {id} = req.params;

    //Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id, {
        include:[
            {model: Mensaje, as: 'mensajes', 
                include: [
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            }
        ]
    });

    if(!propiedad)
        return res.redirect('/my-properties')

    //Revisar que quien visita la url es el mismo que creó la propiedad
    if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
        return res.redirect('/my-properties')


    res.render('properties/messages', {
        pagina: `Mensajes de la propiedad: ${propiedad.titulo}`,
        mensajes: propiedad.mensajes,
        formatearFecha //Nota como podemos pasar funciones
    })
}

export{
    admin,
    create,
    save,
    addImage,
    saveImage,
    edit,
    saveUpdate,
    deletee,
    changeState,
    showProperty,
    sendMessage,
    viewMessages
}
import {Sequelize} from 'sequelize';
import {Precio, Categoria, Propiedad} from '../models/index.js';

const startPage = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include:[
                {model: Precio, as: 'precio'}
            ],
            order:[['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include:[
                {model: Precio, as: 'precio'}
            ],
            order:[['createdAt', 'DESC']]
        })
    ])

    console.log(req.usuario)

    res.render('startPage',{
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos,
        csrfToken: req.csrfToken(),
        nombre: req.usuario?.nombre,
        usuarioLogeado: req?.usuario !== null && req?.usuario !== undefined
    });
}

const categories = async(req, res) =>{
    const {id} = req.params;

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if(!categoria)
        return res.redirect('/404');
    //Obtener las propiedades de esa categoria
    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: categoria.nombre + 's en Venta',
        propiedades,
        csrfToken: req.csrfToken(),
        nombre: req.usuario?.nombre,
        usuarioLogeado: req?.usuario !== null && req?.usuario !== undefined
    })
}

const notFound = (req, res) =>{
    res.render('404', {
        pagina: 'Página no encontrada',
        csrfToken: req.csrfToken(),
        nombre: req.usuario?.nombre,
        usuarioLogeado: req?.usuario !== null && req?.usuario !== undefined
    })
}

const searchEngine = async (req, res) =>{
    const {termino} = req.body;
    //Validar que termino no este vacío
    if(!termino.trim())
        return res.redirect('back');

    //Consultar propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%' //Con esto busca el termino en cualquier lugar del titulo
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })
    
    res.render('busqueda', {
        pagina: 'Resultados de la busqueda',
        propiedades,
        csrfToken: req.csrfToken(),
        nombre: req.usuario?.nombre,
        usuarioLogeado: req?.usuario !== null && req?.usuario !== undefined
    })
}

export{
    startPage,
    categories,
    notFound,
    searchEngine
}
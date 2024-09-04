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

    res.render('startPage',{
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos
    });
}

const categories = (req, res) =>{
    
}

const notFound = (req, res) =>{

}

const searchEngine = (req, res) =>{

}

export{
    startPage,
    categories,
    notFound,
    searchEngine
}
import {Propiedad, Precio, Categoria} from '../models/index.js';

const properties = async (req, res) => {
    //Como tengo pocos registros voy a mostrar todas las propiedades
    //Un JSON no hara que las consultas a la BD sean mas rapidas ni nada
    //Pero si hay muchos registros debería de considerar mostrar pocos

    const propiedades = await Propiedad.findAll({
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'}
        ]
    })

    res.json(propiedades)
}

export{
    properties
}
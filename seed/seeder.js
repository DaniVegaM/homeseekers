import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import {Categoria, Precio, Usuario} from "../models/index.js"
import db from '../config/db.js';

const importarDatos = async () =>{
    try {
        //Autenticar en db
        await db.authenticate();
        //Generar las columnas
        await db.sync();
        //Insertamos los datos

        // await Categoria.bulkCreate(categorias);
        // await Precio.bulkCreate(precios);

        //En este caso al ser queries independientes pueden correr en paralelo
        //Si fueran dependientes uno del otro, entonces si utilizamos doble await
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos importados correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1); //exit(0) -> Termina Correcto   ||    exit(1) -> Termina con Error
    }
}

const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ])

        await db.sync({force: true}); //Forma mas simple para limpiar la bd

        console.log('Datos eliminados correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2] == "-i"){ //Process es interno de node js lee los argumentos y cuando se lea el -i importa los datos
    importarDatos();
}
if(process.argv[2] == "-e"){ //Process es interno de node js lee los argumentos y cuando se lea el -e elimina los datos
    eliminarDatos();
}
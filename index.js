// const express = require("express"); //Common JS
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

//Crear la app

const app = express();

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}));

//Conexion a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log('Conexión establecida con la BD');
} catch(error){
    console.log(error);
}

//Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta publica
app.use(express.static('public'));

//Routing
app.use('/auth', usuarioRoutes); 
    //Aqui "use" lo que hace a diferencia de use busca las rutas que empiezen con algo
    //Get solo busca rutas exactas

//Definir un puerto y arrancar el proyecto
const port  = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta funcionanto en el puerto: ${port}`);
});
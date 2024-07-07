import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';

//Aquí son funciones que le pasas la ruta de la vista y como segundo parametro atributos

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion"
    });
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        pagina: "Crear Cuenta"
    });
}
const register = async(req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').notEmpty().withMessage('El e-mail es obligatorio').bail().isEmail().withMessage('Eso no parece un E-mail').run(req);
    await check('password').isLength({min: 8}).withMessage('La contraseña debe ser de almenos 8 caracteres').run(req);
    await check('repetir_password').equals('password').withMessage('Las contraseñas no coinciden').run(req);

    //Verificar que haya pasado la verificacion
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/register', {
            pagina: "Crear Cuenta",
            errores: resultado.array(), //Le pasamos el array con los mensajes de errores
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        });
    }

    //Verificar que el usuario no este duplicado
    //NOTA: Puedes hacerlo mas bonito con destructuring lo de email nombre y todo eso
    const existeUsuario = await Usuario.findOne({where: {email: req.body.email}});

    if(existeUsuario){
        return res.render('auth/register', {
            pagina: "Crear Cuenta",
            errores: [{msg: 'El usuario ya existe'}], //Le pasamos el array con los mensajes de errores
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        }); 
    }

    await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: 123
    });


}

const formularioForgottenPassword = (req, res) => {
    res.render('auth/forgottenPassword', {
        pagina: "¿Olvidaste tu contraseña?"
    });
}

export{
    formularioLogin,
    formularioRegister,
    register,
    formularioForgottenPassword
}
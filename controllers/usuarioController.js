import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarID } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

//Aquí son funciones que le pasas la ruta de la vista y como segundo parametro atributos

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion"
    });
}

const formularioRegister = (req, res) => {

    res.render('auth/register', {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        }); 
    }

    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarID()
    });

    //Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    });

    //Mostar mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: `Te hemos enviado un correo a ${usuario.email} por favor presiona en el enlace para confirmar tu cuenta` 
    })


}

//Funcion que comprueba una cuenta
const confirmar = async (req, res) =>{
    const {token} = req.params;

    //Verificar si token es valido
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        res.render('auth/confirmarCuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta',
            error: true
        })
    } else{
        //Confirmar la cuenta
        usuario.token = null; //Eliminamos token porque es de un solo uso
        usuario.confirmado = true;
        await usuario.save(); //Metood del ORM para guardar cambios en la BD

        res.render('auth/confirmarCuenta', {
            pagina: 'Cuenta confirmada',
            mensaje: 'La cuenta se confirmó correctamente'
        })
    }
    
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
    confirmar,
    formularioForgottenPassword
}
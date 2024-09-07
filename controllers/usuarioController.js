import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarJWT, generarID, } from '../helpers/tokens.js';
import { emailRegistro, emailPasswordForgotten } from '../helpers/emails.js';

//Aquí son funciones que le pasas la ruta de la vista y como segundo parametro atributos

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken()
    });
}

const auntenticate = async (req, res) => {
    //Validacion
    await check('email').notEmpty().withMessage('El e-mail es obligatorio').bail().isEmail().withMessage('Eso no parece un E-mail').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            errores: resultado.array(), //Le pasamos el array con los mensajes de errores
            csrfToken: req.csrfToken(),
        });
    }

    //Comprobar que el usuario existe
    const {email, password} = req.body
    
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario){
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            errores: [{msg: 'El usuario no existe'}],
            csrfToken: req.csrfToken(),
        });
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            errores: [{msg: 'Tu cuenta no ha sido confirmada aún'}],
            csrfToken: req.csrfToken(),
        });
    }

    //Revisar password
    if (!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: "Iniciar Sesion",
            errores: [{msg: 'La contraseña es incorrecta'}],
            csrfToken: req.csrfToken(),
        });
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre});
    
    //Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true
        // secure: true, NECESITAS SSL PERO SI SON BUENAS OPCIONES
        // sameSite: true
    }).redirect('/my-properties')
}

const logout = (req, res) =>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')
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
        pagina: "¿Olvidaste tu contraseña?",
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req, res) => {
    //Validacion
    await check('email').notEmpty().withMessage('El e-mail es obligatorio').bail().isEmail().withMessage('Eso no parece un E-mail').run(req);

    //Verificar que haya pasado la verificacion
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/forgottenPassword', {
            pagina: "¿Olvidaste tu contraseña?",
            csrfToken: req.csrfToken(),
            errores: resultado.array() //Le pasamos el array con los mensajes de errores
        });
    }

    //Buscar al usuario
    const {email} = req.body;
    
    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario){
        return res.render('auth/forgottenPassword', {
            pagina: "¿Olvidaste tu contraseña?",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
        });
    } else{
        usuario.token = generarID();
        await usuario.save();

        //Enviar email
        emailPasswordForgotten({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        //Renderizar
        res.render('templates/mensaje', {
            pagina: 'Recupera tu cuenta',
            mensaje: 'Hemos enviado un email con las instrucciones para recuperar tu cuenta'
        })
    }
}

const checkToken = async (req, res) => {
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        res.render('auth/confirmarCuenta', {
            pagina: 'Reestablece tu contraseña',
            mensaje: 'Hubo un error al confirmar tu información, intenta de nuevo',
            error: true,
        })
    }
    //Mostrar formulario para agregar su nueva contraseña
    res.render('auth/resetPassword', {
        pagina: 'Reestablece tu contraseña',
        csrfToken: req.csrfToken()
    })
}
const newPassword = async (req, res) => {
    //Validar password
    await check('password').isLength({min: 8}).withMessage('La contraseña debe ser de almenos 8 caracteres').run(req);
    await check('repetir-password').equals('password').withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/resetPassword', {
            pagina: "Reestablece tu contraseña",
            errores: resultado.array(), //Le pasamos el array con los mensajes de errores
            csrfToken: req.csrfToken()
        });
    }

    //Identificar usuario que hizo el cambio
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({where: {token}});

    //En este punto afuerzas el usuario debe existir por el token y todo lo que tiene, entonces no lo validamos
    const salt = await bcrypt.genSalt(10); //El 10 significa las rondas que hace de hasheo
    usuario.password = await bcrypt.hash(password, salt); //Actualizamos el password

    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmarCuenta', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'La contraseña se guardo correctamente'
    })

}

export{
    formularioLogin,
    auntenticate,
    logout,
    formularioRegister,
    register,
    confirmar,
    formularioForgottenPassword,
    resetPassword,
    checkToken,
    newPassword
}
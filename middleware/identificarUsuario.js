import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const identificarUsuario = async (req, res, next) => {
    //Identificar si hay un token en cookies
    const {_token:token} = req.cookies;
    if(!token){
        req.Usuario = null;
        return next();
    }
    //Comprobar el token
    try {
        //Si pasa la verificacion el decode guarda la informacion de el JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);
        
        if(usuario){
            req.usuario = usuario;
        }
        return next();
    } catch (error) {
        console.log(error);

        //Si la cookie ya expiró o algo por el estilo que vuelva a iniciar sesion
        return res.clearCookie('_token').redirect('/auth/login');
    }
}
export default identificarUsuario;
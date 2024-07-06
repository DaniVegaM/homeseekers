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
const formularioForgottenPassword = (req, res) => {
    res.render('auth/forgottenPassword', {
        pagina: "¿Olvidaste tu contraseña?"
    });
}

export{
    formularioLogin,
    formularioRegister,
    formularioForgottenPassword
}
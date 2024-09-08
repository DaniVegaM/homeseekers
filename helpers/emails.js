import nodemailer from "nodemailer"

const emailRegistro = async datos =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const {nombre, email, token} = datos;

      //Enviar email
      await transport.sendMail({
        from: 'HomeSeekers.com',
        to: email,
        subject: 'Confirma tu cuenta en HomeSeekers', // Subject line
        text: '', // plain text body
        html: `<p>Hola ${nombre}! Da click en el enlace para confirmar tu cuenta en HomeSeekers por favor :)</p>
                <p>Tu cuenta ya esta lista, solo debes dar click en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>
                
                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
                `,
      })
}

const emailPasswordForgotten = async datos =>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const {nombre, email, token} = datos;

    //Enviar email
    await transport.sendMail({
      from: 'HomeSeekers.com',
      to: email,
      subject: 'Recupera tu cuenta en HomeSeekers', // Subject line
      text: '', // plain text body
      html: `<p>Hola ${nombre}! Has solicitado reestablecer tu contraseña en HomeSeekers</p>
              <p>Da click en el enlace para crear una nueva contraseña: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recoverAccount/${token}">Recuperar Cuenta</a></p>
              
              <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar el mensaje</p>
              `,
    })
}

export{
    emailRegistro,
    emailPasswordForgotten
}
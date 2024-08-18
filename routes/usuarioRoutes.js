import express from "express";
import { formularioLogin, auntenticate, formularioRegister, formularioForgottenPassword, register, confirmar, resetPassword, checkToken, newPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', auntenticate);

router.get('/register', formularioRegister);
router.post('/register', register);

router.get('/confirmar/:token', confirmar);

router.get('/forgottenPassword', formularioForgottenPassword);
router.post('/forgottenPassword', resetPassword);

router.get('/recoverAccount/:token', checkToken);
router.post('/recoverAccount/:token', newPassword);



export default router;
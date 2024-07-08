import express from "express";
import { formularioLogin, formularioRegister, formularioForgottenPassword, register, confirmar } from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/register', formularioRegister);
router.post('/register', register);

router.get('/confirmar/:token', confirmar);

router.get('/forgottenPassword', formularioForgottenPassword);




export default router;
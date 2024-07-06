import express from "express";
import { formularioLogin, formularioRegister, formularioForgottenPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin);
router.get('/register', formularioRegister);
router.get('/forgottenPassword', formularioForgottenPassword);


export default router;
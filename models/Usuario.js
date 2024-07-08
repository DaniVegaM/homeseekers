import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from '../config/db.js';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    confirmado: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async (usuario) => {
            const salt = await bcrypt.genSalt(10); //El 10 significa las rondas que hace de hasheo
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

export default Usuario;
const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {
    // Extraigo las propiedades emial, password del objeto "body".
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });

        // verificar Email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no es válido',
            });
        }

        // verificar Contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no es válido',
            });
        }

        // Generar Token - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado',
        });
    }
};

module.exports = {
    login,
};
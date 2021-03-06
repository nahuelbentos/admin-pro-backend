const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');

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
            menu: getMenuFrontend(usuarioDB.role),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado',
        });
    }
};

const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true,
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend(usuario.role),
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
};

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token,
        menu: getMenuFrontend(usuario.role),
    });
};

module.exports = {
    login,
    googleSignIn,
    renewToken,
};
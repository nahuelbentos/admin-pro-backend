const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario.model');

const validarJWT = (req, res = response, next) => {
    // Los headers que empiecen con "x-" son headers personalizados.
    // Leer el token
    const token = req.header('x-token');
    console.log('tokebn: ', token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta token de authorización en el request',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        console.log('uid: ', uid);
        // Si llega a este punto, el token es correcto entonces guardo el uid en la request.
        req.uid = uid;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido.',
        });
    }
    next();
};

const validarADMIN_ROLE_O_MismoUsuario = async(req, res = response, next) => {
    const uid = req.uid;
    const id = req.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'No existe el usuario',
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || id === uid) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios de administrador.',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado.',
        });
    }
};

const validarADMIN_ROLE = async(req, res = response, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'No existe el usuario',
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios de administrador.',
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado.',
        });
    }
};

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_O_MismoUsuario,
};
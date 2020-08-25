const { response } = require('express');

const Usuario = require('../models/usuario.model');

const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    // const usuarios = await Usuario.find({}, 'nombre email google role ').skip(desde).limit(5);

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email google role img ').skip(desde).limit(20),
        Usuario.countDocuments(),
    ]);

    res.json({
        ok: true,
        usuarios,
        total,
    });
};

const crearUsuarios = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar Token - JWT
        const token = await generarJWT(usuario.id);

        console.log('usuario: ', usuario);
        console.log('token: ', token);
        res.json({
            ok: true,
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
};

const actualizarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    // TODO: Validar token y comprobar si es el usuario correcto

    try {
        const usuarioDB = await Usuario.findById(uid);
        console.log('usuarioDB: ', usuarioDB);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe en la base de datos.',
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe el mail en la base de datos',
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
};

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        console.log('usuarioDB: ', usuarioDB);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe en la base de datos.',
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            uid,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.',
        });
    }
};

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
};
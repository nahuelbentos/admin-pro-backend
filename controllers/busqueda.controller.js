const { response } = require('express');

const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getBusqueda = async(req, res = response) => {
    try {
        const filtro = req.params.filtro;
        const regex = new RegExp(filtro, 'i');
        // const usuarios = await Usuario.find({ nombre: regex });

        const [usuarios, medicos, hospitales] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Medico.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
        ]);
        // const busqueda = await Hospital.find().populate('usuario', 'nombre email');

        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
};

const getDocumentosColeccion = async(req, res = response) => {
    try {
        const tabla = req.params.tabla;
        const filtro = req.params.filtro;
        const regex = new RegExp(filtro, 'i');

        let data = [];
        switch (tabla) {
            case 'medicos':
                data = await Medico.find({ nombre: regex }).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
                break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que ser usuarios/medicos/hospitales',
                });
        }

        res.json({
            ok: true,
            resultados: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
};

module.exports = {
    getBusqueda,
    getDocumentosColeccion,
};
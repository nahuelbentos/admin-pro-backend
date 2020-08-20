const { response } = require('express');

const Hospital = require('../models/hospital.model');

const getHospitales = async(req, res = response) => {
    try {
        const hospitales = await Hospital.find().populate('usuario', 'nombre email');

        res.json({
            ok: true,
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

const crearHospital = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body,
    });

    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
};
const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital',
    });
};
const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarHospital',
    });
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
};
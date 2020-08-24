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

const actualizarHospital = async(req, res = response) => {
    try {
        const id = req.params.id;
        const uid = req.uid;

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado.',
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid,
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });
        hospital.nombre = req.body.nombre;

        res.json({
            ok: true,
            hospital: hospitalActualizado,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
};

const borrarHospital = async(req, res = response) => {
    try {
        const id = req.params.id;

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado.',
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado',
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
};
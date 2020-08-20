/* 
  Ruta: /api/hospitales;
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales.controller');

const router = Router();

router.get('/', [], getHospitales);

router.post('/', [validarJWT, check('nombre', 'El nombre del hospital es necesario').not().isEmpty()], crearHospital);

router.put('/:id', [validarJWT], actualizarHospital);

router.delete('/:id', [validarJWT], borrarHospital);

module.exports = router;
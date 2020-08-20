/* 
  Ruta: /api/medicos;
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', [], getMedicos);

router.post(
    '/', [
        validarJWT,
        check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos,
    ],
    crearMedico
);

router.put('/:id', [validarJWT], actualizarMedico);

router.delete('/:id', [validarJWT], borrarMedico);

module.exports = router;
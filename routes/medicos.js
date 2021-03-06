/* 
  Ruta: /api/medicos;
 */

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, getMedicoById, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', [validarJWT], getMedicos);

router.get('/:id', [validarJWT], getMedicoById);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser valido').isMongoId(),
    validarCampos,
  ],
  crearMedico
);

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser valido').isMongoId(),
    validarCampos,
  ],
  actualizarMedico
);

router.delete('/:id', [validarJWT], borrarMedico);

module.exports = router;

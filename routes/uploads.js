/* 
  Ruta: /api/uploads/:tipo/:id;
 */

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, getImagen } = require('../controllers/uploads.controller');

const router = Router();

// default options
router.use(expressFileUpload());

router.put('/:tipo/:id', [validarJWT], fileUpload);
router.get('/:tipo/:foto', [validarJWT], getImagen);

module.exports = router;
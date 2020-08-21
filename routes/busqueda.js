/* 
  Ruta: /api/busqueda/:filtro;
 */

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getBusqueda, getDocumentosColeccion } = require('../controllers/busqueda.controller');

const router = Router();

router.get('/:filtro', [validarJWT], getBusqueda);
router.get('/coleccion/:tabla/:filtro', [validarJWT], getDocumentosColeccion);

module.exports = router;
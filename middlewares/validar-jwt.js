const { response } = require('express');
const jwt = require('jsonwebtoken');

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

module.exports = {
    validarJWT,
};
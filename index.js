require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

// Base de Datos
dbConnection();

console.log(process.env);

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'hola mundo',
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto 3000 ${process.env.PORT}`);
});
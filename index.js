require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de Datos
dbConnection();

// Directorio público
app.use(express.static('public'));

// Rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/busqueda', require('./routes/busqueda'));
app.use('/api/upload', require('./routes/uploads'));

//Configuración para que funcione el refresh de la carpeta 'public'es decir, la app angular.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto   ${process.env.PORT}`);
});
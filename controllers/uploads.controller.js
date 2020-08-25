const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req, res = response) => {
  try {
    const tipo = req.params.tipo;
    const id = req.params.id;
    // const usuarios = await Usuario.find({ nombre: regex });

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        ok: false,
        msg: 'No es ',
      });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        ok: false,
        msg: 'No hay ningún archivo',
      });
    }

    // Procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValida.includes(extensionArchivo)) {
      return res.status(400).send({
        ok: false,
        msg: 'El archivo no es de un tipo permitido, ("png", "jpg", "jpeg", "gif")',
      });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({
          ok: false,
          msg: 'Error al mover la imagen',
        });
      }

      // Actualizar base de datos
      actualizarImagen(tipo, id, nombreArchivo);
      res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const getImagen = async (req, res = response) => {
  try {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    // const usuarios = await Usuario.find({ nombre: regex });

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
      res.sendFile(pathImg);
    } else {
      const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
      res.sendFile(pathImg);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

module.exports = {
  fileUpload,
  getImagen,
};

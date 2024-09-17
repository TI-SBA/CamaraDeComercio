const express = require('express');
const router = express.Router();
const db = require('../config/database');  // La conexión a la base de datos
const nodemailer = require('nodemailer');

// Ruta para el registro de usuario
router.post('/register', (req, res) => {
  const { ruc_dni, nombre_completo, correo_contacto, telefono_contacto, empresa } = req.body;

  if (!ruc_dni || !nombre_completo || !correo_contacto || !telefono_contacto) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Insertar en la base de datos
  const query = `
    INSERT INTO contacto (ruc_dni, nombre_completo, correo_contacto, telefono_contacto, empresa)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [ruc_dni, nombre_completo, correo_contacto, telefono_contacto, empresa], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Después del registro, enviar un correo
    enviarCorreo(correo_contacto, nombre_completo)
      .then(() => res.status(201).json({ message: 'Usuario registrado y correo enviado' }))
      .catch((err) => res.status(500).json({ message: 'Usuario registrado pero error al enviar correo', error: err }));
  });
});




function enviarCorreo(correo, nombre) {
  return new Promise((resolve, reject) => {
    // Configuración de Nodemailer con tu servidor de correos
    const transporter = nodemailer.createTransport({
      host: 'mail.sbarequipa.org.pe.',  // Aquí va la dirección de tu servidor SMTP
      port: 587,                    // El puerto SMTP, puede ser 465 para SSL o 587 para TLS
      secure: false,                 // True para 465, false para otros puertos (TLS)
      auth: {
        user: 'tecnologias_informacion@sbarequipa.org.pe',  // Tu cuenta de correo en el servidor
        pass: 'Sbarequipa141*'              // Tu contraseña
      },
      tls: {
        rejectUnauthorized: false  // En caso de que tu servidor no tenga un certificado SSL/TLS válido
      }
    });

    const mailOptions = {
      from: 'tecnologias_informacion@sbarequipa.org.pe', // El remitente (debe ser un correo de tu dominio)
      to: correo,                       // El correo del destinatario
      subject: 'Registro Exitoso',
      text: `Hola ${nombre}, gracias por registrarte en nuestra plataforma.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return reject(error);
      }
      console.log('Correo enviado: ' + info.response);
      resolve(info);
    });
  });
}


module.exports = router;

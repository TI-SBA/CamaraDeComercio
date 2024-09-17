const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Cambia esto por tu contraseña
  database: 'empresaDB'  // Cambia esto por el nombre de tu base de datos
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

module.exports = connection;

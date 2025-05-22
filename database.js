const mysql = require('mysql2/promise');

// Crear la conexión con MySQL usando un pool para mejor rendimiento
const pool = mysql.createPool({
  host: 'localhost', // Dirección del servidor MySQL
  user: 'root',      // Usuario de la base de datos
  password: '',      // Contraseña (si tienes una, agrégala aquí)
  database: 'pruebajdbc', // Nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas SQL
async function query(sql, params) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    console.error("Error en la consulta:", err);
    throw err;
  }
}

// Exportar el pool de conexiones y la función de consulta
module.exports = { pool, query };
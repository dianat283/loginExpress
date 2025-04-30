const express = require('express');
const app = express(); // Inicializar la aplicación Express
const port = 5000; // Definir el puerto en el que se ejecutará el servidor

// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Create the connection to database
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'pruebajdbc',
});

// Ruta inicial para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Hello World!'); // Responder con un mensaje simple
});
// Ruta para manejar inicio de sesión
app.get('/login',async (req, res) => { //req = request, peticion; res = response, respuesta
  const datos = req.query; // Obtener los datos enviados en la URL (usuario y contraseña)
  try {
  // Realizar consulta SQL para verificar si el usuario existe en la base de datos
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `contraseña` = ?",
      [datos.usuario, datos.contraseña]
    );
    // Verificar si los datos del usuario coinciden con un registro
    if (results.length > 0) {
      res.status(200).send('Inicio de sesion correcto') // Respuesta si los datos son válidos
    } else {
      res.status(401).send('Datos incorrectos') // Respuesta si los datos son inválidos
    }

    console.log(results); // Imprimir los resultados de la consulta
    console.log(fields); // Mostrar metadatos adicionales de la consulta
  } catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor'); // Respuesta si hay un error interno
  }
});
app.get('/validar', (req, res) => {
  res.send('Sesion validada'); // Respuesta de validación exitosa
});

// Iniciar el servidor 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`); // Mensaje para indicar que el servidor está activo
})
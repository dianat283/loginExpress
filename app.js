const express = require('express');
// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express(); // Inicializar la aplicación Express
const port = 5000; // Definir el puerto en el que se ejecutará el servidor

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

// crar un usuario
app.post('/login', async (req, res) => {
  console.log(req.body); // Verifica qué datos llegan realmente
  if (!req.body.usuario || !req.body.contraseña) {
      return res.status(400).json({ error: "Faltan datos en el cuerpo de la solicitud" });
  }

  const { usuario, contraseña } = req.body;
  res.status(200).json({ mensaje: "Datos recibidos correctamente" });

  try {
    await connection.query(
        "INSERT INTO usuarios (ID, usuario, contraseña) VALUES (NULL, ?, ?)", [usuario, contraseña]
    );
    res.json({ mensaje: 'Usuario Creado exitosamente' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor');
  }
});

app.get('/validar', (req, res) => {
  res.send('Sesion validada'); // Respuesta de validación exitosa
});

// Actualizar un usuario
app.put('/login', async (req, res) => {
  const { usuario, nuevaContraseña } = req.body;

  if (!usuario || !nuevaContraseña) {
      return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
      await connection.query(
          "UPDATE usuarios SET contraseña = ? WHERE usuario = ?",
          [nuevaContraseña, usuario]
      );
      res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (err) {
      console.log(err);
      res.status(500).send('Error en el servidor');
  }
});


//   // Ruta aseguradora para verificar que el servidor está funcionando
app.get('/test', (req, res) => {
  res.json({ mensaje: "El servidor está funcionando correctamente" });
});

app.get('/', (req, res) => {
res.send('Hola Mundo!'); // Responder con un mensaje simple
});

// Ruta para manejar inicio de sesión
app.get('/aseguradoras', async (req, res) => {
  try {
      const [results] = await connection.query("SELECT * FROM aseguradora");
      res.setHeader('Content-Type', 'application/json'); // Establecer encabezado JSON
      res.json(results);
  } catch (err) {
      console.error("Error en la consulta:", err); // Verifica el mensaje exacto en la terminal
      res.status(500).json({ error: "Error en el servidor" });    
  }
  });

// crear un usuario
app.post('/aseguradoras', async (req, res) => {
console.log("Datos recibidos:", req.body); // Verifica qué datos están llegando
const {identificacion, razon_social, cobertura } = req.body;

if (!identificacion || !razon_social || !cobertura) {
  return res.status(400).json({ error: "Todos los campos son obligatorios" });
}

try {
  await connection.query(
    "INSERT INTO aseguradora (identificacion, razon_social, cobertura) VALUES (?, ?, ?)",
    [identificacion, razon_social, cobertura]
  );
  res.status(201).json({ mensaje: "Aseguradora creada exitosamente" });
} catch (err) {
  console.error(err);
  res.status(500).send('Error en el servidor');
}
});

app.get('/validar', (req, res) => {
res.send('Sesion validada'); // Respuesta de validación exitosa
});

// Actualizar un usuario
app.put('/aseguradoras/:id', async (req, res) => {
  const { id } = req.params;
  const { identificacion, razon_social, cobertura} = req.body;

  if (!identificacion || !razon_social || !cobertura) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    await connection.query(
      "UPDATE aseguradora SET identificacion = ?, razon_social = ?, cobertura = ? WHERE id_aseguradora = ?",
      [identificacion, razon_social, cobertura, id]
    );
    res.json({ mensaje: "Aseguradora actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});
//Fin aseguradora

// Iniciar el servidor 
app.listen(port, () => {
  console.log(`Servidor Corriendo en http://localhost:${port}`); // Mensaje para indicar que el servidor está activo
})
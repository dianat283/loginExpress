const express = require('express');
const path = require('path');
const { query } = require('./database'); // Importar la conexión a la base de datos

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para manejar datos en formato JSON

// Ruta principal para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📌 Ruta para obtener aseguradoras desde la base de datos
app.get('/aseguradoras', async (req, res) => {
    try {
        const aseguradoras = await query("SELECT * FROM aseguradora");
        res.json(aseguradoras);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Ruta para crear una nueva aseguradora
app.post('/aseguradoras', async (req, res) => {
    const { identificacion, razon_social, cobertura } = req.body;
    
    if (!identificacion || !razon_social || !cobertura) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        await query("INSERT INTO aseguradora (identificacion, razon_social, cobertura) VALUES (?, ?, ?)", 
            [identificacion, razon_social, cobertura]);
        res.status(201).json({ mensaje: "Aseguradora creada exitosamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 📌 Ruta para actualizar aseguradoras
app.put('/aseguradoras/:id', async (req, res) => {
    const { id } = req.params;
    const { identificacion, razon_social, cobertura } = req.body;

    if (!identificacion || !razon_social || !cobertura) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        await query("UPDATE aseguradora SET identificacion = ?, razon_social = ?, cobertura = ? WHERE id_aseguradora = ?", 
            [identificacion, razon_social, cobertura, id]);
        res.json({ mensaje: "Aseguradora actualizada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
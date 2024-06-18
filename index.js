import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());

const productosPath = './productos.json';
const usuariosPath = './usuarios.json';
const ventasPath = './ventas.json';

// Leer datos de archivos JSON
const readData = (path) => {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
};

const writeData = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
};

// Rutas para productos
app.get('/productos', (req, res) => {
  const productos = readData(productosPath);
  res.json(productos);
});

app.get('/productos/:id', (req, res) => {
  const productos = readData(productosPath);  
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

app.post('/productos', (req, res) => {
  const productos = readData(productosPath);
  const newProducto = req.body;
  productos.push(newProducto);
  writeData(productosPath, productos);
  res.status(201).json(newProducto);
});

// Rutas para usuarios
app.get('/usuarios', (req, res) => {
  const usuarios = readData(usuariosPath);
  res.json(usuarios);
});

app.get('/usuarios/:id', (req, res) => {
  const usuarios = readData(usuariosPath);
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).send('Usuario no encontrado');
  }
});

app.post('/usuarios', (req, res) => {
  const usuarios = readData(usuariosPath);
  const newUsuario = req.body;
  usuarios.push(newUsuario);
  writeData(usuariosPath, usuarios);
  res.status(201).json(newUsuario);
});

app.put('/usuarios/:id', (req, res) => {
    const emailNuevo = req.body.email;
  const usuarios = readData(usuariosPath);
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    usuarios[index].email = emailNuevo
    writeData(usuariosPath, usuarios);
    res.json(usuarios[index]);
  } else {
    res.status(404).send('Usuario no encontrado');
  }
});

app.delete('/usuarios/:id', (req, res) => {
  const usuarios = readData(usuariosPath);
  const ventas = readData(ventasPath);
  const id = parseInt(req.params.id);
  const usuarioTieneVentas = ventas.some(v => v.id_usuario === id);

  if (usuarioTieneVentas) {
    res.status(400).send('No se puede eliminar el usuario, tiene ventas asociadas');
  } else {
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    writeData(usuariosPath, nuevosUsuarios);
    res.sendStatus(204);
  }
});

// Rutas para ventas
app.get('/ventas', (req, res) => {
  const ventas = readData(ventasPath);
  res.json(ventas);
});

app.get('/ventas/:id', (req, res) => {
  const ventas = readData(ventasPath);
  const venta = ventas.find(v => v.id === parseInt(req.params.id));
  if (venta) {
    res.json(venta);
  } else {
    res.status(404).send('Venta no encontrada');
  }
});

app.post('/ventas', (req, res) => {
  const ventas = readData(ventasPath);
  const newVenta = req.body;
  ventas.push(newVenta);
  writeData(ventasPath, ventas);
  res.status(201).json(newVenta);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

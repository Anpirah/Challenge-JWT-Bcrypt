
const express = require('express');
const router = express.Router();
const {generateToken, verifyToken} = require('../middlewares/authMiddleware.js');
const users = require('../data/users.js');


router.get('/', (req, res) => {
    let loginform
    if(req.session.token) {
        loginform = `
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesión</button>
        </form>        
        `
    } else {
        loginform = `
        <form action="/login" method="post">
          <label for="username">Usuario :</label>
          <input type="text" id="username" name="username" required><br>
    
          <label for="password">Contraseña :</label>
          <input type="password" id="password" name="password" required><br>
    
          <button type="submit">Iniciar sesión</button>
        </form>        
        `
    }
    res.send(loginform)
});

router.post('/login', (req, res) =>{
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      const token = generateToken(user);
      req.session.token = token;
      res.redirect('/dashboard');
    } else {
      res.status(401).json({ mensaje: 'Credenciales Incorrectas' });
    }
});

router.get('/dashboard', verifyToken, (req, res) => {
    // Aquí puedes colocar la lógica para el panel de control
    res.send('¡Bienvenido al panel de control!');
});


router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router

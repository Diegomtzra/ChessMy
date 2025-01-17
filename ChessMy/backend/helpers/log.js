const express = require('express');
const session = require('express-session')
const passport = require('passport');

require('./auth');

const  Usuario  = require('../models/usuario'); // Ajusta la ruta si es necesario
const Curso = require('../models/cursos'); // Ajusta la ruta según tu estructura de carpetas


const isLoggedIn = async (req = Request, res = Response, next) => {

    console.log(" ando en isLoggedIn");
    try {
        console.log(" ando en el try catch");
        console.log (req.user);
        // Verifica si el usuario está autenticado y el correo existe en la base de datos
        if (req.user && req.user.emails[0].value) {

          
            const correo = req.user.emails[0].value;

            console.log(" ando en el if");

            // Busca al usuario en la base de datos
            const usuario = await Usuario.findOne({ where: { correoUsuario: correo } });

            console.log("Aqui toy");
            console.log(usuario.idUsuario);

            if (usuario) {
                
                return next(); // Si el usuario existe, pasa al siguiente middleware
            } else {
                return res.status(404).send('Usuario no encontrado en la base de datos'); // Si no existe, error 404
            }
        } else {
            return res.sendStatus(401); // Si no está autenticado, devuelve un estado 401
        }
    } catch (error) {
        console.error('Error en el middleware isLoggedIn:', error);
        return res.status(500).send('Error interno del servidor'); // Manejo de errores inesperados
    }
    
};


const toLog = async (req = Request, res = Response) => {
    try {
        res.send('<a href="/api/admin/auth/google">Autentificación con Google</a>');

    } catch (error) {
        console.error('Error en toLog:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const googleAuth = async (req = Request, res = Response, next) => {
    try {
        passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
    } catch (error) {
        console.error('Error en googleAuth:', error);
        res.status(500).send('Error interno del servidor');
    }
};
/*
const googleCallback = async (req, res, next) => {
    try {
        passport.authenticate('google', (err, user, info) => {
            if (err) {
                return res.status(500).send('Error interno del servidor');
            }
            if (!user) {
                return res.redirect('/api/admin/auth/failure');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(500).send('Error interno al iniciar sesión');
                }
                // Redirige al archivo 1.html después de la autenticación
                req.session.userId = user.idUsuario;
                return res.redirect(`/Inicio/Inicio.html?idUsuario=${user.idUsuario}`);
            });
        })(req, res, next);
    } catch (error) {
        console.error('Error en googleCallback:', error);
        res.status(500).send('Error interno del servidor');
    }
};*/

const googleCallback = async (req, res, next) => {
    try {
        passport.authenticate('google', async (err, user, info) => {
            if (err) {
                return res.status(500).send('Error interno del servidor');
            }
            if (!user) {
                return res.redirect('/api/admin/auth/failure');
            }
            req.logIn(user, async (err) => {
                if (err) {
                    return res.status(500).send('Error interno al iniciar sesión');
                }

                // Busca al usuario en la base de datos
                const usuario = await Usuario.findOne({ where: { correoUsuario: user.emails[0].value } });

                if (!usuario) {
                    return res.status(404).send('Usuario no encontrado en la base de datos');
                }

                // Asignar el ID del usuario a la sesión
                req.session.userId = usuario.idUsuario;

                // Redirigir con el idUsuario en la URL
                return res.redirect(`/Inicio/Inicio.html?idUsuario=${usuario.idUsuario}`);
            });
        })(req, res, next);
    } catch (error) {
        console.error('Error en googleCallback:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const authFailure = async (req = Request, res = Response) => {
    try {
        res.send('Something went wrong');
    } catch (error) {
        console.error('Error en authFailure:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const protectedRoute = async (req = Request, res = Response) => {
    try {
        res.send(`
            <h1>Bienvenido</h1>
            <p>Nombre: ${req.user.displayName}</p>
            <p>Correo: ${req.user.emails[0].value}</p>
            <p>Foto: <img src="${req.user.photos[0].value}" alt="Foto de perfil"></p>
            <br><a href="/api/admin/logout">Cerrar sesión</a>
        `);

    } catch (error) {
        console.error('Error en protectedRoute:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const logout = async (req = Request, res = Responses) => {
    try {
        req.logout();
        req.session.destroy();
        return res.redirect('/');
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = {
    isLoggedIn,
    toLog,
    googleAuth,
    googleCallback,
    authFailure,
    protectedRoute,
    logout,
};

// const { Router } = require('express');

// const { createAlumno,
//     getUsuarioById,
//     updateAlumno, 
//     deleteAlumno,
//     showAlumnos, 
//     createMaestro, 
//     updateMaestro,
//     deleteMaestro,
//     showMaestros,
//     createAdmin,
//     updateAdmin,
//     showAdmins,
//     deleteAdmin,
// } = require('../controllers/admin/users');

// const router = new Router();

const express = require('express');
const passport = require('passport');
const session = require('express-session')
const router = express.Router();

// controllers/cursos/cursosController
const {
    createCurso, 
    getCursosUsuario, 
    showCurso, 
    registerAlumnoToCurso,
    getAllCursos,
    getUsuariosDeCurso,

} = require('../controllers/cursos/cursosController');
const { createAlumno,
    getUsuarioById,
    updateAlumno, 
    deleteAlumno,
    showAlumnos, 
    createMaestro, 
    updateMaestro,
    deleteMaestro,
    showMaestros,
    createAdmin,
    updateAdmin,
    showAdmins,
    deleteAdmin, 
    createSolicitudBan,
    deleteSolicitudBan,
    getSolicitudesBan,
} = require('../controllers/admin/users'); // Archivo donde están las funciones de CRUD

const {isLoggedIn,    
    toLog,
    googleAuth,
    googleCallback,
    authFailure,
    protectedRoute,
    logout,} = require('../helpers/log');

const { createAlumno1,
    getUsuarioById1,
    
} = require('../controllers/singin-out/in_out');

const Usuario = require('../models/usuario');




// Rutas para CRUD de Alumno
router.post('/alumno', createAlumno);

router.get('/usuario/:id',getUsuarioById);

router.put('/alumno/:id', updateAlumno);

router.delete('/alumno/:id',deleteAlumno);

router.get('/alumnos', showAlumnos);

// Rutas para CRUD de Maestro
router.post('/maestro', createMaestro);

router.get('/maestro/:id', getUsuarioById);

router.put('/maestro/:id', updateMaestro);

router.delete('/maestro/:id', deleteMaestro);

router.get('/maestros', showMaestros);

// Rutas para CRUD de Admin
router.post('/admin', createAdmin);

router.get('/admin/:id', getUsuarioById);

router.put('/admin/:id', updateAdmin);

router.delete('/admin/:id', deleteAdmin);

router.get('/admins', showAdmins);

//solicitudes de ban

router.post('/createSolicitudBan', createSolicitudBan);

router.get('/getAllSolicitudesBan', getSolicitudesBan);

router.delete('/deleteSolicitudBan/:id', deleteSolicitudBan);

//test
router.post('/alumno1', createAlumno1);

router.get('/usuario1/:id',getUsuarioById1);


// login  
router.get('/toLog', toLog);

router.get('/auth/google', googleAuth);

router.get('/google/callback', googleCallback);

router.get('/auth/failure', authFailure);

router.get('/protected', isLoggedIn, protectedRoute);

router.get('/logout', logout);

//cursos
router.post('/createCurso',createCurso);

router.get('/getCurso/:id', showCurso);

router.get('/getCursoUsuario/:id', getCursosUsuario);

router.post('/registerAlumnoToCurso', registerAlumnoToCurso );

// Ruta para obtener todos los cursos
router.get('/getAllCursos', getAllCursos);

router.get('/cursos/:idCurso/usuarios', getUsuariosDeCurso);



module.exports = router;

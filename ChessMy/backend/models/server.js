const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');

const passport = require('passport');
const session = require('express-session');

const path = require('path'); // Asegúrate de importar 'path'
const { isLoggedIn } = require('../helpers/log'); // Ajusta la ruta según tu estructura

const { dbConnection } = require('../controllers/database');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        this.conectarDB();

        this.app.use(express.json());

        this.admin = '/api/admin';   

        //sesion passport 
        this.app.use(session({ secret: 'cats'}));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.routes();
        // this.alumno = '/api/alumno';
        // this.maestro = '/api/maestro';
        // this.usuario = '/api/usuario';
        this.middlwares();
        

    }

    middlwares() {
        this.app.use(cors());
        
        this.app.use(express.static('public'));
        this.app.use(fileupload({
            useTempFiles: true,
            templateUrl: '/temp/',
        }));

        
    }
    
    async conectarDB() {
        console.log('Entrando a dbCOn');
        await dbConnection();
    }

    routes(){
        this.app.use(this.admin, require('../routes/admin.routes'));
        // this.app.use(this.alumno, require('../routes/admin.routes'));
        // this.app.use(this.maestro, require('../routes/admin.routes'));
        // this.app.use(this.usuario, require('../routes/admin.routes'));
        
        this.app.get('/Inicio/Inicio.html', isLoggedIn, (req, res) => {
            res.sendFile(path.join(__dirname, '../public/Inicio/Inicio.html')); 
        });
        this.app.get('/CRUDMaestros/Maestros.html', isLoggedIn, (req, res) => {
            res.sendFile(path.join(__dirname, '../public/CRUDMaestros/Maestros.html')); 
        });
        this.app.get('/CRUDAlumnos/Alumnos.html', isLoggedIn, (req, res) => {
            res.sendFile(path.join(__dirname, '../public/CRUDAlumnos/Alumnos.html')); 
        });
        this.app.get('/CRUDCursos/Cursos.html', isLoggedIn, (req, res) => {
            res.sendFile(path.join(__dirname, '../public/CRUDCursos/Cursos.html')); 
        });
    }


    listen() {
        this.app.listen(this.port, (req, res) => {
            console.log('listening on port', this.port);
        });
    }
}

module.exports = Server
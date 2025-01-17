const { DataTypes } = require('sequelize');
const { sequelize } = require('../controllers/database');
const Calendario = require('./calendarios');
const Usuario = require('./usuario'); // Importa el modelo Usuario
const UsuarioCurso = require('./usuariosCursos'); 

const Curso = sequelize.define('Curso', {
    idCurso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombreCurso: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    idLlamada: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir nulos si no siempre se proporciona
    },
    cursoToken: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir nulos si no siempre se proporciona
    },
    precio: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitir nulos si no siempre se proporciona
    },
    idCalendario: {
        type: DataTypes.INTEGER,
        references: {
            model: Calendario,
            key: 'idCalendario',
        },
        allowNull: true, // Permitir nulos si no siempre hay un calendario asociado
    },
}, {
    tableName: 'Cursos',
    timestamps: false,
});

module.exports = Curso;

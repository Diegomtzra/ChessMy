const { DataTypes } = require('sequelize');
const { sequelize } = require('../controllers/database');
const Usuario = require('../models/usuario');
const Curso = require('../models/cursos');

const UsuarioCurso = sequelize.define('UsuarioCurso', {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'idUsuario',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

    },
    idCurso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Curso,
            key: 'idCurso',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    rolUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName:'UsuarioCurso',
    tableName: 'Usuarios-Cursos',
    timestamps: false,
});

module.exports = UsuarioCurso;

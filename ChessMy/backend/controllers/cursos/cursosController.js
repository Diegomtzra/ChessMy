const  Usuario  = require('../../models/usuario');
const Curso = require('../../models/cursos'); 
// const CursoPublicacion = require('../../models/cursoPublicacion'); 
// const PublicacionTablon = require('../../models/publicacionTablon'); 
// const CursosPubTab = require('../../models/cursoPublicacionTablon');  
const UsuarioCurso = require('../../models/usuariosCursos');  
const { request, response } = require('express');
const { randomBytes } = require('crypto');
const { v4: uuidv4 } = require('uuid');

// const createCurso = async(req = request,res = response) => {
//     console.log('body1',req.body);

//     try {
//         // TODO crear el resto de cosas del curso como el tablon, los comentarios, publicaciones, etc
//         //TODO crear el curso en la tabla de relacion 
//         console.log('body',req.body);
//         const curso = await Curso.create({
//             ...req.body,
//         });
//         return res.status(201).json(curso);
//     } catch (error) {
//         return res.status(400).json({ message: 'Error al crear el curso', error });
        
//     }
// };


const createIdLlamada = () => {
    return uuidv4();
};

const createCursoToken = () => {
    return randomBytes(12).toString('hex');
};

const createCurso = async (req = request, res = response) => {
    console.log('body1', req.body);

    try {
        // Crear el curso en la tabla principal Curso
        console.log('body', req.body);

        const idLlamada = createIdLlamada();
        const cursoToken = createCursoToken();

        const curso = await Curso.create({
            ...req.body,
            idLlamada,
            cursoToken,
        });

        // TODO: Obtener el idUsuario (puedes pasarlo desde el body o asignarlo)
        const { idUsuario } = req.body;

        if (!idUsuario) {
            return res.status(400).json({ message: 'idUsuario es requerido para registrar la relación.' });
        }

        // Registrar la relación en la tabla intermedia UsuarioCurso
        await UsuarioCurso.create({
            idUsuario: idUsuario,
            idCurso: curso.idCurso, // id del curso recién creado
            rolUsuario: 'maestro'
        });

        return res.status(201).json({
            message: 'Curso creado y relación con el usuario registrada correctamente.',
            curso,
        });

    } catch (error) {
        return res.status(400).json({ message: 'Error al crear el curso', error });
    }
};


const getCursosUsuario = async(req = request, res = response) => {
    try {
      const usuarioConCursos = await Usuario.findOne({
        where: { idUsuario: req.params.id },
        include: {
          model: Curso,
          through: { attributes: [] }, // Para no obtener los atributos de la tabla intermedia
        },
      });
      return res.status(200).json(usuarioConCursos);
    } catch (error) {
      return res.status(400).json({ message: 'Error al cargar los cursos del usuario', error });
    }
  };
  

const showCurso = async(req = request,res = response) => {
    //TODO hacer mas get del curso en caso de que se necesiten mostrar mas cosas y mostrar cosas que tenga que ver con las relaciones 
    try{
        const curso = await Curso.findAll({ where: { idCurso: req.params.id } });
        return res.status(200).json(curso);
    } catch(error){
        return res.status(400).json({ message: 'Error al cargar el curso', error });
    }
};



const registerAlumnoToCurso = async(req = request, res = response) => {
    try {
        const { idUsuario, cursoToken } = req.body;

        // Validar que los datos requeridos estén presentes
        if (!idUsuario || !cursoToken) {
            return res.status(400).json({ message: 'idUsuario y cursoToken son requeridos.' });
        }

         // Buscar el curso por el token proporcionado
         const curso = await Curso.findOne({ where: { cursoToken } });

         if (!curso) {
             return res.status(404).json({ message: 'Curso no encontrado con el cursoToken proporcionado.' });
         }
 
         // Verificar si el usuario ya está registrado en el curso
         const existeRelacion = await UsuarioCurso.findOne({
             where: {
                 idUsuario,
                 idCurso: curso.idCurso,
             },
         });

         if (existeRelacion) {
            return res.status(400).json({ message: 'El usuario ya está registrado en este curso.' });
        }

        // Registrar al alumno en el curso
        await UsuarioCurso.create({
            idUsuario,
            idCurso: curso.idCurso,
            rolUsuario: 'alumno', // Asignar el rol de alumno
        });

        return res.status(201).json({
            message: 'Alumno registrado en el curso exitosamente.',
            curso,
        });

    } catch (error) {

        return res.status(400).json({message: 'Error al registrar al alumno', error});
    }
};

//////CRIS ESTOS YO LOS PUSE UNO ES PARA MOSTRAR TODOS LOS CURSOS DE LA TABLA Y EL OTRO ES PARA MOSTRAR A LOS USUARIOS INSCRITOS A ESE CURSO DESDE EL PUNTO DEL VISTA DEL CURSO 
//////NO DEL USUARIO///////////////////
////////////////////////////////////

const getAllCursos = async (req = request, res = response) => {
    try {
        // Recuperar todos los cursos de la tabla `Curso`
        const cursos = await Curso.findAll();

        // Responder con los cursos obtenidos
        return res.status(200).json(cursos);
    } catch (error) {
        // Manejo de errores
        return res.status(400).json({ message: 'Error al obtener todos los cursos', error });
    }
};

const getUsuariosDeCurso = async (req = request, res = response) => {
    try {
        const { idCurso } = req.params; // Obtener el id del curso desde los parámetros de la solicitud

        // Verificar que se proporcione el idCurso
        if (!idCurso) {
            return res.status(400).json({ message: 'idCurso es requerido.' });
        }

        // Buscar los usuarios asociados al curso mediante la tabla intermedia UsuarioCurso
        const cursoConUsuarios = await Curso.findOne({
            where: { idCurso },
            include: {
                model: Usuario,
                through: { attributes: [] }, // Para no incluir los atributos de la tabla intermedia
            },
        });

        // Verificar si el curso existe
        if (!cursoConUsuarios) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }

        // Responder con los usuarios del curso
        return res.status(200).json(cursoConUsuarios);
    } catch (error) {
        return res.status(400).json({ message: 'Error al obtener los usuarios del curso', error });
    }
};

module.exports = {
    createCurso,
    getCursosUsuario,
    showCurso,
    registerAlumnoToCurso,
    getAllCursos,
    getUsuariosDeCurso
}
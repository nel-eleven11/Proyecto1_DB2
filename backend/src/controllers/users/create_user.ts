// controllers/usuarios/create_usuario.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import { type Usuario } from '../../interfaces/nodeInterfaces';
import type { UsuarioTieneCuentaRel, UsuarioPoseeDispositivoRel, UsuarioPropietarioTarjetaRel } from '../../interfaces/relationshipInterfaces';

export const create_user: RequestHandler = async (req, res) => {
  try {
    const id_usuario = uuidv4();

    // Node properties
    const {
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email,
      pais,
      ciudad,
      nit,
      fecha_registro
    } = req.body as Partial<Usuario>;



    const createQuery = `
      CREATE (u:Usuario {
        id_usuario: $id_usuario,
        nombre: $nombre,
        apellido: $apellido,
        fecha_nacimiento: $fecha_nacimiento,
        telefono: $telefono,
        email: $email,
        pais: $pais,
        ciudad: $ciudad,
        nit: $nit,
        fecha_registro: $fecha_registro
      })


      RETURN u
    `;

    const result = await executeCypherQuery(createQuery, {
      id_usuario,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      email,
      pais,
      ciudad,
      nit,
      fecha_registro
    });

    const createdUser = result.records?.[0]?.get('u')?.properties;
    if (!createdUser) {
      res.status(400).json({ message: 'Failed to create Usuario' });
    }

    res.status(201).json({
      message: 'Usuario created successfully',
      data: createdUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating Usuario',
      error
    });
  }
};


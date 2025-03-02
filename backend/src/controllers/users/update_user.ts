// controllers/usuarios/update_usuario.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import { type Usuario } from '../../interfaces/nodeInterfaces';
import type { UsuarioTieneCuentaRel, UsuarioPoseeDispositivoRel, UsuarioPropietarioTarjetaRel } from '../../interfaces/relationshipInterfaces';

export const update_user: RequestHandler = async (req, res) => {
  try {
    const { id_usuario } = req.params;

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

    // Relationship props
    const {
      // For (Usuario)-[:TIENE]->(Cuenta)
      id_cuenta,
      status,
      cliente_vip,
      seguro,
      // For (Usuario)-[:POSEE]->(Dispositivo)
      id_dispositivo,
      huella_dactilar,
      reconocimiento_facial,
      ubicaciones,
      // For (Usuario)-[:PROPIETARIO]->(Tarjeta)
      id_tarjeta,
      chip,
      tiempo_de_uso,
      membresia
    } = req.body as {
      id_cuenta?: string;
      id_dispositivo?: string;
      id_tarjeta?: string;
    } & Partial<UsuarioTieneCuentaRel> &
      Partial<UsuarioPoseeDispositivoRel> &
      Partial<UsuarioPropietarioTarjetaRel>;

    // 1) Update the Usuario node
    const updateNodeQuery = `
      MATCH (u:Usuario { id_usuario: $id_usuario })
      SET
        u.nombre = COALESCE($nombre, u.nombre),
        u.apellido = COALESCE($apellido, u.apellido),
        u.fecha_nacimiento = COALESCE($fecha_nacimiento, u.fecha_nacimiento),
        u.telefono = COALESCE($telefono, u.telefono),
        u.email = COALESCE($email, u.email),
        u.pais = COALESCE($pais, u.pais),
        u.ciudad = COALESCE($ciudad, u.ciudad),
        u.nit = COALESCE($nit, u.nit),
        u.fecha_registro = COALESCE($fecha_registro, u.fecha_registro)
      RETURN u
    `;
    await executeCypherQuery(updateNodeQuery, {
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

    // 2) Relationship updates:
    if (id_cuenta) {
      const updateTieneRel = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:TIENE]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.status = COALESCE($status, r.status),
          r.cliente_vip = COALESCE($cliente_vip, r.cliente_vip),
          r.seguro = COALESCE($seguro, r.seguro)
        RETURN r
      `;
      await executeCypherQuery(updateTieneRel, {
        id_usuario,
        id_cuenta,
        status,
        cliente_vip,
        seguro
      });
    }
    if (id_dispositivo) {
      const updatePoseeRel = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:POSEE]->(d:Dispositivo { id_dispositivo: $id_dispositivo })
        SET
          r.huella_dactilar = COALESCE($huella_dactilar, r.huella_dactilar),
          r.reconocimiento_facial = COALESCE($reconocimiento_facial, r.reconocimiento_facial),
          r.ubicaciones = COALESCE($ubicaciones, r.ubicaciones)
        RETURN r
      `;
      await executeCypherQuery(updatePoseeRel, {
        id_usuario,
        id_dispositivo,
        huella_dactilar,
        reconocimiento_facial,
        ubicaciones
      });
    }
    if (id_tarjeta) {
      const updatePropietarioRel = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:PROPIETARIO]->(t:Tarjeta { id_tarjeta: $id_tarjeta })
        SET
          r.chip = COALESCE($chip, r.chip),
          r.tiempo_de_uso = COALESCE($tiempo_de_uso, r.tiempo_de_uso),
          r.membresia = COALESCE($membresia, r.membresia)
        RETURN r
      `;
      await executeCypherQuery(updatePropietarioRel, {
        id_usuario,
        id_tarjeta,
        chip,
        tiempo_de_uso,
        membresia
      });
    }

    // 3) Return the updated Usuario
    const fetchUpdated = `
      MATCH (u:Usuario { id_usuario: $id_usuario })
      RETURN u
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_usuario });
    const updatedUser = result.records?.[0]?.get('u')?.properties;

    if (!updatedUser) {
      res.status(404).json({ message: 'Usuario not found after update' });
    }

    res.status(200).json({
      message: 'Usuario updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Usuario',
      error
    });
  }
};


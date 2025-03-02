// controllers/dispositivos/update_dispositivo.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Dispositivo } from '../../interfaces/nodeInterfaces';
import type { UsuarioPoseeDispositivoRel } from '../../interfaces/relationshipInterfaces';

export const update_device: RequestHandler = async (req, res) => {
  try {
    const { id_dispositivo } = req.params;

    // Node properties
    const {
      tipo,
      marca,
      modelo,
      sistema_operativo,
      fecha_ultimo_uso
    } = req.body as Partial<Dispositivo>;

    // Relationship to Usuario
    const {
      id_usuario,
      huella_dactilar,
      reconocimiento_facial,
      ubicaciones
    } = req.body as { id_usuario?: string } & Partial<UsuarioPoseeDispositivoRel>;

    // 1) Update the Dispositivo node
    const updateNodeQuery = `
      MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })
      SET
        d.tipo = COALESCE($tipo, d.tipo),
        d.marca = COALESCE($marca, d.marca),
        d.modelo = COALESCE($modelo, d.modelo),
        d.sistema_operativo = COALESCE($sistema_operativo, d.sistema_operativo),
        d.fecha_ultimo_uso = COALESCE($fecha_ultimo_uso, d.fecha_ultimo_uso)
      RETURN d
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_dispositivo,
      tipo,
      marca,
      modelo,
      sistema_operativo,
      fecha_ultimo_uso
    });

    // 2) Update the :POSEE relationship if id_usuario is provided
    if (id_usuario) {
      const updateRelQuery = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:POSEE]->(d:Dispositivo { id_dispositivo: $id_dispositivo })
        SET
          r.huella_dactilar = COALESCE($huella_dactilar, r.huella_dactilar),
          r.reconocimiento_facial = COALESCE($reconocimiento_facial, r.reconocimiento_facial),
          r.ubicaciones = COALESCE($ubicaciones, r.ubicaciones)
        RETURN r
      `;
      await executeCypherQuery(updateRelQuery, {
        id_usuario,
        id_dispositivo,
        huella_dactilar,
        reconocimiento_facial,
        ubicaciones
      });
    }

    // 3) Fetch updated
    const fetchUpdated = `
      MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })
      RETURN d
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_dispositivo });
    const updatedDevice = result.records?.[0]?.get('d')?.properties;

    if (!updatedDevice) {
      res.status(404).json({ message: 'Dispositivo not found after update' });
    }

    res.status(200).json({
      message: 'Dispositivo updated successfully',
      data: updatedDevice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Dispositivo',
      error
    });
  }
};


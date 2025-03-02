// controllers/dispositivos/create_dispositivo.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Dispositivo } from '../../interfaces/nodeInterfaces';
import type { UsuarioPoseeDispositivoRel } from '../../interfaces/relationshipInterfaces';

export const create_device: RequestHandler = async (req, res) => {
  try {
    const id_dispositivo = uuidv4();

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

    // 1) MERGE the Dispositivo node
    const mergeDispositivoQuery = `
      MERGE (d:Dispositivo { id_dispositivo: $id_dispositivo })
      ON CREATE SET
        d.tipo = $tipo,
        d.marca = $marca,
        d.modelo = $modelo,
        d.sistema_operativo = $sistema_operativo,
        d.fecha_ultimo_uso = $fecha_ultimo_uso
      RETURN d
    `;
    await executeCypherQuery(mergeDispositivoQuery, {
      id_dispositivo,
      tipo,
      marca,
      modelo,
      sistema_operativo,
      fecha_ultimo_uso
    });

    // 2) MERGE (Usuario)-[:POSEE]->(Dispositivo)
    if (id_usuario) {
      const mergeRelQuery = `
        MERGE (u:Usuario { id_usuario: $id_usuario })
        MERGE (d:Dispositivo { id_dispositivo: $id_dispositivo })
        MERGE (u)-[r:POSEE]->(d)
        ON CREATE SET
          r.huella_dactilar = $huella_dactilar,
          r.reconocimiento_facial = $reconocimiento_facial,
          r.ubicaciones = $ubicaciones
      `;
      await executeCypherQuery(mergeRelQuery, {
        id_usuario,
        id_dispositivo,
        huella_dactilar,
        reconocimiento_facial,
        ubicaciones
      });
    }

    // 3) Fetch & return
    const fetchQuery = `
      MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })
      RETURN d
    `;
    const result = await executeCypherQuery(fetchQuery, { id_dispositivo });
    const createdDevice = result.records?.[0]?.get('d')?.properties;

    res.status(201).json({
      message: 'Dispositivo merged/created successfully',
      data: createdDevice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating/merging Dispositivo',
      error
    });
  }
};


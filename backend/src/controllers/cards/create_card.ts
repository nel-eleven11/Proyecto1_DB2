// controllers/tarjetas/create_tarjeta.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Tarjeta } from '../../interfaces/nodeInterfaces';
import type { TarjetaAsociadaACuentaRel, UsuarioPropietarioTarjetaRel } from '../../interfaces/relationshipInterfaces';

export const create_card: RequestHandler = async (req, res) => {
  try {
    const id_tarjeta = uuidv4();

    // Node properties
    const {
      tipo,
      contactless,
      marca,
      fecha_expiracion,
      estado,
      numero
    } = req.body as Partial<Tarjeta>;

    // Relationship to Cuenta
    const {
      id_cuenta,
      limite_credito,
      numero_de_uso,
      fecha_asociacion
    } = req.body as { id_cuenta?: string } & Partial<TarjetaAsociadaACuentaRel>;

    // Relationship to Usuario
    const {
      id_usuario,
      chip,
      tiempo_de_uso,
      membresia
    } = req.body as { id_usuario?: string } & Partial<UsuarioPropietarioTarjetaRel>;

    // 1) MERGE the Tarjeta node
    const mergeTarjetaQuery = `
      MERGE (t:Tarjeta { id_tarjeta: $id_tarjeta })
      ON CREATE SET
        t.tipo = $tipo,
        t.contactless = $contactless,
        t.marca = $marca,
        t.fecha_expiracion = $fecha_expiracion,
        t.estado = $estado,
        t.numero = $numero
      RETURN t
    `;
    await executeCypherQuery(mergeTarjetaQuery, {
      id_tarjeta,
      tipo,
      contactless,
      marca,
      fecha_expiracion,
      estado,
      numero
    });

    // 2) MERGE (Tarjeta)-[:ASOCIADA_A]->(Cuenta)
    if (id_cuenta) {
      const mergeCuentaRel = `
        MERGE (t:Tarjeta { id_tarjeta: $id_tarjeta })
        MERGE (c:Cuenta { id_cuenta: $id_cuenta })
        MERGE (t)-[r:ASOCIADA_A]->(c)
        ON CREATE SET
          r.limite_credito = $limite_credito,
          r.numero_de_uso = $numero_de_uso,
          r.fecha_asociacion = $fecha_asociacion
      `;
      await executeCypherQuery(mergeCuentaRel, {
        id_tarjeta,
        id_cuenta,
        limite_credito,
        numero_de_uso,
        fecha_asociacion
      });
    }

    // 3) MERGE (Usuario)-[:PROPIETARIO]->(Tarjeta)
    if (id_usuario) {
      const mergePropietarioRel = `
        MERGE (u:Usuario { id_usuario: $id_usuario })
        MERGE (t:Tarjeta { id_tarjeta: $id_tarjeta })
        MERGE (u)-[r:PROPIETARIO]->(t)
        ON CREATE SET
          r.chip = $chip,
          r.tiempo_de_uso = $tiempo_de_uso,
          r.membresia = $membresia
      `;
      await executeCypherQuery(mergePropietarioRel, {
        id_usuario,
        id_tarjeta,
        chip,
        tiempo_de_uso,
        membresia
      });
    }

    // 4) Fetch & return
    const fetchQuery = `
      MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })
      RETURN t
    `;
    const result = await executeCypherQuery(fetchQuery, { id_tarjeta });
    const createdTarjeta = result.records?.[0]?.get('t')?.properties;

    res.status(201).json({
      message: 'Tarjeta merged/created successfully',
      data: createdTarjeta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating/merging Tarjeta',
      error
    });
  }
};


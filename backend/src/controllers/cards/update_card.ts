// controllers/tarjetas/update_tarjeta.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Tarjeta } from '../../interfaces/nodeInterfaces';
import type { TarjetaAsociadaACuentaRel, UsuarioPropietarioTarjetaRel } from '../../interfaces/relationshipInterfaces';

export const update_card: RequestHandler = async (req, res) => {
  try {
    const { id_tarjeta } = req.params;

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

    // 1) Update node properties
    const updateNodeQuery = `
      MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })
      SET
        t.tipo = COALESCE($tipo, t.tipo),
        t.contactless = COALESCE($contactless, t.contactless),
        t.marca = COALESCE($marca, t.marca),
        t.fecha_expiracion = COALESCE($fecha_expiracion, t.fecha_expiracion),
        t.estado = COALESCE($estado, t.estado),
        t.numero = COALESCE($numero, t.numero)
      RETURN t
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_tarjeta,
      tipo,
      contactless,
      marca,
      fecha_expiracion,
      estado,
      numero
    });

    // 2) Update the :ASOCIADA_A relationship if id_cuenta is given
    if (id_cuenta) {
      const updateCuentaRel = `
        MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })-[r:ASOCIADA_A]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.limite_credito = COALESCE($limite_credito, r.limite_credito),
          r.numero_de_uso = COALESCE($numero_de_uso, r.numero_de_uso),
          r.fecha_asociacion = COALESCE($fecha_asociacion, r.fecha_asociacion)
        RETURN r
      `;
      await executeCypherQuery(updateCuentaRel, {
        id_tarjeta,
        id_cuenta,
        limite_credito,
        numero_de_uso,
        fecha_asociacion
      });
    }

    // 3) Update the :PROPIETARIO relationship if id_usuario is given
    if (id_usuario) {
      const updatePropRel = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:PROPIETARIO]->(t:Tarjeta { id_tarjeta: $id_tarjeta })
        SET
          r.chip = COALESCE($chip, r.chip),
          r.tiempo_de_uso = COALESCE($tiempo_de_uso, r.tiempo_de_uso),
          r.membresia = COALESCE($membresia, r.membresia)
        RETURN r
      `;
      await executeCypherQuery(updatePropRel, {
        id_usuario,
        id_tarjeta,
        chip,
        tiempo_de_uso,
        membresia
      });
    }

    // 4) Fetch updated
    const fetchUpdated = `
      MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })
      RETURN t
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_tarjeta });
    const updatedTarjeta = result.records?.[0]?.get('t')?.properties;

    if (!updatedTarjeta) {
      res.status(404).json({ message: 'Tarjeta not found after update' });
    }

    res.status(200).json({
      message: 'Tarjeta updated successfully',
      data: updatedTarjeta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Tarjeta',
      error
    });
  }
};


// controllers/bancos/update_banco.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import { type Banco } from '../../interfaces/nodeInterfaces';
import { type BancoConexionConBancoRel } from '../../interfaces/relationshipInterfaces';

export const update_bank: RequestHandler = async (req, res) => {
  try {
    const { id_banco } = req.params;

    // Node properties
    const {
      nombre,
      pais,
      direccion,
      telefono,
      sitio_web
    } = req.body as Partial<Banco>;

    // Relationship to another Banco
    const {
      id_banco2,
      tipo_conexion,
      monto_total_movido,
      frecuencia_transacciones
    } = req.body as {
      id_banco2?: string;
    } & Partial<BancoConexionConBancoRel>;

    // Update node
    const updateNodeQuery = `
      MATCH (b:Banco { id_banco: $id_banco })
      SET 
        b.nombre = COALESCE($nombre, b.nombre),
        b.pais = COALESCE($pais, b.pais),
        b.direccion = COALESCE($direccion, b.direccion),
        b.telefono = COALESCE($telefono, b.telefono),
        b.sitio_web = COALESCE($sitio_web, b.sitio_web)
      RETURN b
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_banco,
      nombre,
      pais,
      direccion,
      telefono,
      sitio_web
    });

    // If updating the :CONEXION_CON relationship
    if (id_banco2) {
      const updateRelQuery = `
        MATCH (b:Banco { id_banco: $id_banco })-[r:CONEXION_CON]->(b2:Banco { id_banco: $id_banco2 })
        SET
          r.tipo_conexion = COALESCE($tipo_conexion, r.tipo_conexion),
          r.monto_total_movido = COALESCE($monto_total_movido, r.monto_total_movido),
          r.frecuencia_transacciones = COALESCE($frecuencia_transacciones, r.frecuencia_transacciones)
        RETURN r
      `;
      await executeCypherQuery(updateRelQuery, {
        id_banco,
        id_banco2,
        tipo_conexion,
        monto_total_movido,
        frecuencia_transacciones
      });
    }

    // Return updated node
    const fetchUpdated = `
      MATCH (b:Banco { id_banco: $id_banco })
      RETURN b
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_banco });
    const updatedBanco = result.records?.[0]?.get('b')?.properties;

    if (!updatedBanco) {
      res.status(404).json({
        message: 'Banco not found after update'
      });
    }

    res.status(200).json({
      message: 'Banco updated successfully',
      data: updatedBanco
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Banco',
      error
    });
  }
};


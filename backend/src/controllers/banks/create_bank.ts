// controllers/bancos/create_banco.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import { type Banco } from '../../interfaces/nodeInterfaces';
import { type BancoConexionConBancoRel } from '../../interfaces/relationshipInterfaces';

export const create_bank: RequestHandler = async (req, res) => {
  try {
    const id_banco = uuidv4();

    // Node properties
    const {
      nombre,
      pais,
      direccion,
      telefono,
      sitio_web
    } = req.body as Partial<Banco>;

    // Optional: Connect to another Banco with :CONEXION_CON
    const {
      id_banco2 = null,
      tipo_conexion = '',
      monto_total_movido = 0 ,
      frecuencia_transacciones = 0
    } = req.body as {
      id_banco2?: string;
    } & Partial<BancoConexionConBancoRel>;

    const createQuery = `
      CREATE (b:Banco {
        id_banco: $id_banco,
        nombre: $nombre,
        pais: $pais,
        direccion: $direccion,
        telefono: $telefono,
        sitio_web: $sitio_web
      })
      // Optionally connect to another Banco
      WITH b
      OPTIONAL MATCH (b2:Banco { id_banco: $id_banco2 })
      FOREACH (_ IN CASE WHEN b2 IS NOT NULL THEN [1] ELSE [] END |
        CREATE (b)-[:CONEXION_CON {
          tipo_conexion: $tipo_conexion,
          monto_total_movido: $monto_total_movido,
          frecuencia_transacciones: $frecuencia_transacciones
        }]->(b2)
      )
      RETURN b
    `;

    const result = await executeCypherQuery(createQuery, {
      id_banco,
      nombre,
      pais,
      direccion,
      telefono,
      sitio_web,
      id_banco2,
      tipo_conexion,
      monto_total_movido,
      frecuencia_transacciones
    });

    const createdBanco = result.records?.[0]?.get('b')?.properties;
    if (!createdBanco) {
      res.status(400).json({ message: 'Banco creation failed (invalid second Banco?)' });
    }

    res.status(201).json({
      message: 'Banco created successfully',
      data: createdBanco
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating Banco',
      error
    });
  }
};


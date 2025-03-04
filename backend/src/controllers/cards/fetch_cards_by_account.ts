import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_cards_by_account: RequestHandler = async (req, res) => {
  try {
    const { id_cuenta } = req.params;
    
    if (!id_cuenta) {
      return res.status(400).json({ message: "El id_cuenta es requerido." });
    }

    const cypherQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })<-[:ASOCIADA_A]-(t:Tarjeta)
      RETURN t
    `;

    const result = await executeCypherQuery(cypherQuery, { id_cuenta });
    const tarjetas = result.records.map((record: any) => record.get('t').properties);

    return res.status(200).json({
      message: "Tarjetas asociadas a la cuenta obtenidas exitosamente",
      tarjetas
    });
    
  } catch (error) {
    console.error("Error obteniendo tarjetas por cuenta:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error
    });
  }
};


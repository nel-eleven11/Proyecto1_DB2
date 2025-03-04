import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_transactions_by_account: RequestHandler = async (req, res) => {
  try {
    const { id_cuenta } = req.params;
    
    if (!id_cuenta) {
      return res.status(400).json({ message: "El id_cuenta es requerido." });
    }
    
    const cypherQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })<-[:ASOCIADA_A]-(t:Tarjeta)-[:REALIZA]->(tx:Transaccion)
      RETURN tx
    `;
    
    const result = await executeCypherQuery(cypherQuery, { id_cuenta });
    const transacciones = result.records.map((record: any) => record.get('tx').properties);
    
    return res.status(200).json({
      message: "Transacciones recuperadas exitosamente",
      transacciones
    });
    
  } catch (error) {
    console.error("Error al obtener las transacciones por cuenta:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error
    });
  }
};


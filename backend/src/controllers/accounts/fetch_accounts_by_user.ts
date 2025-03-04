import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';


export const fetch_accounts_by_user_id: RequestHandler = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({ message: "El ID del usuario es requerido." });
    }

    const cypherQuery = `
      MATCH (u:Usuario { id_usuario: $id_usuario })-[:TIENE]->(c:Cuenta)
      RETURN c
    `;

    const result = await executeCypherQuery(cypherQuery, { id_usuario });

    const cuentas = result.records.map((record:any) => record.get('c').properties);

    return res.status(200).json({
      message: "Cuentas obtenidas exitosamente",
      cuentas
    });

  } catch (error) {
    console.error("Error obteniendo cuentas:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error
    });
  }
};


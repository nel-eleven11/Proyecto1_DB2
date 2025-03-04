// controllers/transacciones/delete_transaction.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_transaction: RequestHandler = async (req, res) => {
  try {
    const { id_transaccion } = req.params;

    const deleteQuery = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      DETACH DELETE tx
    `;
    await executeCypherQuery(deleteQuery, { id_transaccion });

    res.status(200).json({
      message: 'Transaccion deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting Transaccion',
      error
    });
  }
};


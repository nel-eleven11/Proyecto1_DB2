// controllers/transacciones/fetch_transaction_by_id.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_transaction_by_id: RequestHandler = async (req, res) => {
  try {
    const { id_transaccion } = req.params;

    const query = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      RETURN tx
    `;
    const result = await executeCypherQuery(query, { id_transaccion });
    const transaction = result.records?.[0]?.get('tx')?.properties;

    if (!transaction) {
      res.status(404).json({ message: 'Transaccion not found' });
    }

    res.status(200).json({
      message: 'Transaccion fetched successfully',
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Transaccion',
      error
    });
  }
};


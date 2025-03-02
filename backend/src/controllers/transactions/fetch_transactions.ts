// controllers/transacciones/fetch_transactions.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_transactions: RequestHandler = async (req, res) => {
  try {
    const query = `
      MATCH (tx:Transaccion)
      RETURN tx
    `;
    const result = await executeCypherQuery(query);
    const transactions = result.records.map((r: any) => r.get('tx').properties);

    res.status(200).json({
      message: 'All Transacciones fetched successfully',
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Transacciones',
      error
    });
  }
};


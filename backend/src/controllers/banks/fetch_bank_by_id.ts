import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_bank_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_banco } = req.params;

    const getByIdQuery = `
      MATCH (b:Banco { id_banco: $id_banco })
      RETURN b
    `;

    const result = await executeCypherQuery(getByIdQuery, { id_banco });
    const banco = result.records?.[0]?.get('b')?.properties;

    if (!banco) {
      res.status(404).json({
        message: 'Banco node not found'
      });
    }

    res.status(200).json({
      message: 'Banco node fetched successfully',
      data: banco
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Banco node',
      error
    });
  }
};

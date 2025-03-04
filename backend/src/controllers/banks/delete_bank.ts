import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_bank: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_banco } = req.params;

    const deleteQuery = `
      MATCH (b:Banco { id_banco: $id_banco })
      DETACH DELETE b
    `;

    await executeCypherQuery(deleteQuery, { id_banco });

    res.status(200).json({
      message: 'Banco node deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete Banco node',
      error
    });
  }
};

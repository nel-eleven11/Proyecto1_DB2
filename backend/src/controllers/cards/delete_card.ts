import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_card: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_tarjeta } = req.params;

    const deleteQuery = `
      MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })
      DETACH DELETE t
    `;
    await executeCypherQuery(deleteQuery, { id_tarjeta });

    res.status(200).json({
      message: 'Tarjeta node deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete Tarjeta node',
      error
    });
  }
};


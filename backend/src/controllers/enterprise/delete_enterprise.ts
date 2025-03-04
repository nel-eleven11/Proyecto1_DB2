import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_enterprise: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_empresa } = req.params;

    const query = `
      MATCH (e:Empresa { id_empresa: $id_empresa })
      DETACH DELETE e
    `;
    await executeCypherQuery(query, { id_empresa });

    res.status(200).json({
      message: 'Empresa node deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete Empresa node',
      error
    });
  }
};


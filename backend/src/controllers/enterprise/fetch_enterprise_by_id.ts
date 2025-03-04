import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_enterprise_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_empresa } = req.params;

    const query = `
      MATCH (e:Empresa { id_empresa: $id_empresa })
      RETURN e
    `;
    const result = await executeCypherQuery(query, { id_empresa });
    const empresa = result.records?.[0]?.get('e')?.properties;

    if (!empresa) {
      res.status(404).json({ message: 'Empresa node not found' });
      return;
    }

    res.status(200).json({
      message: 'Empresa node fetched successfully',
      data: empresa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Empresa node',
      error
    });
  }
};


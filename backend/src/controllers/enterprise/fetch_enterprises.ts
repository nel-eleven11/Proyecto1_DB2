import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_enterprises: RequestHandler = async (req: Request, res: Response) => {
  try {
    const query = `
      MATCH (e:Empresa)
      RETURN e
    `;
    const result = await executeCypherQuery(query);
    const empresas = result.records.map((record: any) => record.get('e').properties);

    res.status(200).json({
      message: 'All Empresa nodes fetched successfully',
      data: empresas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Empresa nodes',
      error
    });
  }
};


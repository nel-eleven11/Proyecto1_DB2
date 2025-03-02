import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_banks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const getAllQuery = `
      MATCH (b:Banco)
      RETURN b
    `;

    const result = await executeCypherQuery(getAllQuery);
    const bancos = result.records.map((record: any) => record.get('b').properties);

    res.status(200).json({
      message: 'All Banco nodes fetched successfully',
      data: bancos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Banco nodes',
      error
    });
  }
};

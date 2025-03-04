import type { RequestHandler, Response, Request } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_cards: RequestHandler = async (req: Request, res: Response) => {
  try {
    const query = `
      MATCH (t:Tarjeta)
      RETURN t
    `;
    const result = await executeCypherQuery(query);

    const cards = result.records.map((record: any) => record.get('t').properties);
    res.status(200).json({
      message: 'All Tarjeta nodes fetched successfully',
      data: cards
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Tarjeta nodes',
      error
    });
  }
};


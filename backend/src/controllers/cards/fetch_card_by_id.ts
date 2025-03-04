import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_card_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_tarjeta } = req.params;

    const query = `
      MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })
      RETURN t
    `;
    const result = await executeCypherQuery(query, { id_tarjeta });
    const card = result.records?.[0]?.get('t')?.properties;

    if (!card) {
      res.status(404).json({ message: 'Tarjeta node not found' });
      return;
    }

    res.status(200).json({
      message: 'Tarjeta node fetched successfully',
      data: card
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Tarjeta node',
      error
    });
  }
};


import type { RequestHandler, Request, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_user_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;

    const query = `
      MATCH (u:Usuario { id_usuario: $id_usuario })
      RETURN u
    `;
    const result = await executeCypherQuery(query, { id_usuario });
    const user = result.records?.[0]?.get('u')?.properties;

    if (!user) {
      res.status(404).json({ message: 'User node not found' });
      return;
    }

    res.status(200).json({
      message: 'User node fetched successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch User node',
      error
    });
  }
};


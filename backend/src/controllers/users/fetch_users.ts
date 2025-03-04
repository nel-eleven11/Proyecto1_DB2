import type { RequestHandler, Request, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_users: RequestHandler = async (req: Request, res: Response) => {
  try {
    const query = `
      MATCH (u:Usuario)
      RETURN u
    `;
    const result = await executeCypherQuery(query);
    const users = result.records.map((record: any) => record.get('u').properties);

    res.status(200).json({
      message: 'All User nodes fetched successfully',
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch User nodes',
      error
    });
  }
};


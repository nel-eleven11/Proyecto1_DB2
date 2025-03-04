import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_accounts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const query = `
      MATCH (c:Cuenta)
      RETURN c
    `;
    const result = await executeCypherQuery(query);

    const accounts = result.records.map((record: any) => record.get('c').properties);

    res.status(200).json({
      message: 'All Accounts (Cuenta) fetched successfully',
      data: accounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Accounts',
      error
    });
  }
};


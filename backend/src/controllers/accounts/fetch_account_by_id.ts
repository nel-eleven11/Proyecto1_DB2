import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_account_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_cuenta } = req.params;

    const query = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      RETURN c
    `;
    const result = await executeCypherQuery(query, { id_cuenta });

    const account = result.records?.[0]?.get('c')?.properties;
    if (!account) {
      res.status(404).json({ message: 'Account (Cuenta) not found' });
      return;
    }

    res.status(200).json({
      message: 'Account fetched successfully',
      data: account
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Account',
      error
    });
  }
};


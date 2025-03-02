import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const freeze_account: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_cuenta } = req.params;

    const updateQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      SET c.estado = "Congelada"
      RETURN c
    `;

    const result = await executeCypherQuery(updateQuery, { id_cuenta });
    const updatedAccount = result.records?.[0]?.get('c')?.properties;
    if (!updatedAccount) {
      res.status(404).json({ message: 'Account not found' });
      return;
    }

    res.status(200).json({
      message: 'Account frozen successfully',
      data: updatedAccount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to freeze Account',
      error
    });
  }
};


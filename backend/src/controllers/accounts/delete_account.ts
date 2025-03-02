import type { Request, RequestHandler, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_account: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_cuenta } = req.params;

    const deleteQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      DETACH DELETE c
    `;
    await executeCypherQuery(deleteQuery, { id_cuenta });

    res.status(200).json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete Account',
      error
    });
  }
};


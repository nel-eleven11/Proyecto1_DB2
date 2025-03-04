import type { Request, Response, RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_user: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;

    const query = `
      MATCH (u:Usuario { id_usuario: $id_usuario })
      DETACH DELETE u
    `;
    await executeCypherQuery(query, { id_usuario });

    res.status(200).json({
      message: 'User node deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete User node',
      error
    });
  }
};


import type { RequestHandler, Response, Request } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const delete_device: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_dispositivo } = req.params;

    const deleteQuery = `
      MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })
      DETACH DELETE d
    `;
    await executeCypherQuery(deleteQuery, { id_dispositivo });

    res.status(200).json({
      message: 'Dispositivo deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete Dispositivo',
      error
    });
  }
};


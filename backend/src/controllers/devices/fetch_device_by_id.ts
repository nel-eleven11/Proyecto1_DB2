import type { RequestHandler, Request, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_device_by_id: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id_dispositivo } = req.params;

    const query = `
      MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })
      RETURN d
    `;
    const result = await executeCypherQuery(query, { id_dispositivo });
    const device = result.records?.[0]?.get('d')?.properties;

    if (!device) {
      res.status(404).json({ message: 'Dispositivo not found' });
      return;
    }

    res.status(200).json({
      message: 'Dispositivo fetched successfully',
      data: device
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Dispositivo',
      error
    });
  }
};


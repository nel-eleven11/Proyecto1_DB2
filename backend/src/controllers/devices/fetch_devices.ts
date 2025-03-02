import type { RequestHandler, Request, Response } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

export const fetch_all_devices: RequestHandler = async (req: Request, res: Response) => {
  try {
    const query = `
      MATCH (d:Dispositivo)
      RETURN d
    `;
    const result = await executeCypherQuery(query);
    const devices = result.records.map((r: any) => r.get('d').properties);

    res.status(200).json({
      message: 'All Dispositivo nodes fetched successfully',
      data: devices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch Dispositivo nodes',
      error
    });
  }
};


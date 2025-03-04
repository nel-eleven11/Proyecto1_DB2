// controllers/empresas/create_empresa.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import { type Empresa } from '../../interfaces/nodeInterfaces';
import { type EmpresaTieneCuentaRel } from '../../interfaces/relationshipInterfaces';

export const create_enterprise: RequestHandler = async (req, res) => {
  try {
    const id_empresa = uuidv4();

    // Node props
    const {
      nombre,
      tipo,
      sector,
      pais,
      telefono,
      email,
      direccion
    } = req.body as Partial<Empresa>;



    const createQuery = `
      CREATE (e:Empresa {
        id_empresa: $id_empresa,
        nombre: $nombre,
        tipo: $tipo,
        sector: $sector,
        pais: $pais,
        telefono: $telefono,
        email: $email,
        direccion: $direccion
      })



      RETURN e
    `;

    const result = await executeCypherQuery(createQuery, {
      id_empresa,
      nombre,
      tipo,
      sector,
      pais,
      telefono,
      email,
      direccion,

    });

    const createdEmpresa = result.records?.[0]?.get('e')?.properties;
    if (!createdEmpresa) {
      res.status(400).json({ message: 'Failed to create Empresa' });
    }

    res.status(201).json({
      message: 'Empresa created successfully',
      data: createdEmpresa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating Empresa',
      error
    });
  }
};


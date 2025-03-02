// controllers/empresas/update_empresa.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Empresa } from '../../interfaces/nodeInterfaces';
import type { EmpresaTieneCuentaRel } from '../../interfaces/relationshipInterfaces';

export const update_enterprise: RequestHandler = async (req, res) => {
  try {
    const { id_empresa } = req.params;

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

    // Relationship (Empresa)-[:TIENE]->(Cuenta)
    const {
      id_cuenta,
      cliente_vip,
      status,
      seguro
    } = req.body as { id_cuenta?: string } & Partial<EmpresaTieneCuentaRel>;

    // 1) Update node
    const updateNodeQuery = `
      MATCH (e:Empresa { id_empresa: $id_empresa })
      SET
        e.nombre = COALESCE($nombre, e.nombre),
        e.tipo = COALESCE($tipo, e.tipo),
        e.sector = COALESCE($sector, e.sector),
        e.pais = COALESCE($pais, e.pais),
        e.telefono = COALESCE($telefono, e.telefono),
        e.email = COALESCE($email, e.email),
        e.direccion = COALESCE($direccion, e.direccion)
      RETURN e
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_empresa,
      nombre,
      tipo,
      sector,
      pais,
      telefono,
      email,
      direccion
    });

    // 2) Update relationship with Cuenta if needed
    if (id_cuenta) {
      const updateRelQuery = `
        MATCH (e:Empresa { id_empresa: $id_empresa })-[r:TIENE]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.cliente_vip = COALESCE($cliente_vip, r.cliente_vip),
          r.status = COALESCE($status, r.status),
          r.seguro = COALESCE($seguro, r.seguro)
        RETURN r
      `;
      await executeCypherQuery(updateRelQuery, {
        id_empresa,
        id_cuenta,
        cliente_vip,
        status,
        seguro
      });
    }

    // 3) Return updated
    const fetchUpdated = `
      MATCH (e:Empresa { id_empresa: $id_empresa })
      RETURN e
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_empresa });
    const updatedEmpresa = result.records?.[0]?.get('e')?.properties;

    if (!updatedEmpresa) {
      res.status(404).json({ message: 'Empresa not found after update' });
    }

    res.status(200).json({
      message: 'Empresa updated successfully',
      data: updatedEmpresa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Empresa',
      error
    });
  }
};


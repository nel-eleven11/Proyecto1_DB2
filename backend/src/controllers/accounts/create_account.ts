// controllers/cuentas/create_cuenta.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Cuenta } from '../../interfaces/nodeInterfaces';
import type { BancoProveeCuentaRel, UsuarioTieneCuentaRel, EmpresaTieneCuentaRel } from '../../interfaces/relationshipInterfaces';

export const create_account: RequestHandler = async (req, res) => {
  try {
    const id_cuenta = uuidv4(); // or accept from client

    // Node properties
    const {
      tipo,
      saldo,
      fecha_apertura,
      fecha_cierre,
      estado
    } = req.body as Partial<Cuenta>;

    // Relationship to Banco
    const {
      id_banco,
      sucursal_origen,
      actividad_reciente,
      networking
    } = req.body as {
      id_banco?: string;
    } & Partial<BancoProveeCuentaRel>;

    // Relationship to either Usuario or Empresa
    const {
      id_usuario,
      id_empresa,
      status,
      cliente_vip,
      seguro
    } = req.body as {
      id_usuario?: string;
      id_empresa?: string;
    } & Partial<UsuarioTieneCuentaRel> & Partial<EmpresaTieneCuentaRel>;

    // 1) MERGE the Cuenta node
    const mergeCuentaQuery = `
      MERGE (c:Cuenta { id_cuenta: $id_cuenta })
      ON CREATE SET
        c.tipo = $tipo,
        c.saldo = $saldo,
        c.fecha_apertura = $fecha_apertura,
        c.fecha_cierre = $fecha_cierre,
        c.estado = $estado
      RETURN c
    `;
    await executeCypherQuery(mergeCuentaQuery, {
      id_cuenta,
      tipo,
      saldo,
      fecha_apertura,
      fecha_cierre,
      estado
    });

    // 2) MERGE (Banco)-[:PROVEE]->(Cuenta) if Banco is specified
    if (id_banco) {
      const mergeBancoRel = `
        MERGE (b:Banco { id_banco: $id_banco })
        MERGE (c:Cuenta { id_cuenta: $id_cuenta })
        MERGE (b)-[r:PROVEE]->(c)
        ON CREATE SET
          r.sucursal_origen = $sucursal_origen,
          r.actividad_reciente = $actividad_reciente,
          r.networking = $networking
      `;
      await executeCypherQuery(mergeBancoRel, {
        id_banco,
        id_cuenta,
        sucursal_origen,
        actividad_reciente,
        networking
      });
    }

    // 3) MERGE (Usuario)-[:TIENE]->(Cuenta) or (Empresa)-[:TIENE]->(Cuenta)
    if (id_usuario) {
      const mergeUsuarioRel = `
        MERGE (u:Usuario { id_usuario: $id_usuario })
        MERGE (c:Cuenta { id_cuenta: $id_cuenta })
        MERGE (u)-[r:TIENE]->(c)
        ON CREATE SET
          r.status = $status,
          r.cliente_vip = $cliente_vip,
          r.seguro = $seguro
      `;
      await executeCypherQuery(mergeUsuarioRel, {
        id_usuario,
        id_cuenta,
        status,
        cliente_vip,
        seguro
      });
    }
    if (id_empresa) {
      const mergeEmpresaRel = `
        MERGE (e:Empresa { id_empresa: $id_empresa })
        MERGE (c:Cuenta { id_cuenta: $id_cuenta })
        MERGE (e)-[r:TIENE]->(c)
        ON CREATE SET
          r.status = $status,
          r.cliente_vip = $cliente_vip,
          r.seguro = $seguro
      `;
      await executeCypherQuery(mergeEmpresaRel, {
        id_empresa,
        id_cuenta,
        status,
        cliente_vip,
        seguro
      });
    }

    // 4) Fetch & return
    const fetchQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      RETURN c
    `;
    const result = await executeCypherQuery(fetchQuery, { id_cuenta });
    const createdCuenta = result.records?.[0]?.get('c')?.properties;

    res.status(201).json({
      message: 'Cuenta merged/created successfully',
      data: createdCuenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating/merging Cuenta',
      error
    });
  }
};


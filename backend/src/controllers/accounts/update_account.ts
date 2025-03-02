// controllers/cuentas/update_cuenta.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Cuenta } from '../../interfaces/nodeInterfaces';
import type { BancoProveeCuentaRel, UsuarioTieneCuentaRel, EmpresaTieneCuentaRel } from '../../interfaces/relationshipInterfaces';

export const update_account: RequestHandler = async (req, res) => {
  try {
    const { id_cuenta } = req.params;

    // Node properties
    const {
      tipo,
      saldo,
      fecha_apertura,
      fecha_cierre,
      estado
    } = req.body as Partial<Cuenta>;

    // Relationship props for Banco->Cuenta
    const {
      id_banco,
      sucursal_origen,
      actividad_reciente,
      networking
    } = req.body as {
      id_banco?: string;
    } & Partial<BancoProveeCuentaRel>;

    // Relationship props for Usuario->Cuenta or Empresa->Cuenta
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

    // 1) Update node properties
    const updateNodeQuery = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      SET
        c.tipo = COALESCE($tipo, c.tipo),
        c.saldo = COALESCE($saldo, c.saldo),
        c.fecha_apertura = COALESCE($fecha_apertura, c.fecha_apertura),
        c.fecha_cierre = COALESCE($fecha_cierre, c.fecha_cierre),
        c.estado = COALESCE($estado, c.estado)
      RETURN c
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_cuenta,
      tipo,
      saldo,
      fecha_apertura,
      fecha_cierre,
      estado
    });

    // 2) Update relationship with Banco (if provided)
    if (id_banco) {
      const updateBancoRel = `
        MATCH (b:Banco { id_banco: $id_banco })-[r:PROVEE]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.sucursal_origen = COALESCE($sucursal_origen, r.sucursal_origen),
          r.actividad_reciente = COALESCE($actividad_reciente, r.actividad_reciente),
          r.networking = COALESCE($networking, r.networking)
        RETURN r
      `;
      await executeCypherQuery(updateBancoRel, {
        id_banco,
        id_cuenta,
        sucursal_origen,
        actividad_reciente,
        networking
      });
    }

    // 3) Update relationship with Usuario or Empresa
    if (id_usuario) {
      const updateUsuarioRel = `
        MATCH (u:Usuario { id_usuario: $id_usuario })-[r:TIENE]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.status = COALESCE($status, r.status),
          r.cliente_vip = COALESCE($cliente_vip, r.cliente_vip),
          r.seguro = COALESCE($seguro, r.seguro)
        RETURN r
      `;
      await executeCypherQuery(updateUsuarioRel, {
        id_usuario,
        id_cuenta,
        status,
        cliente_vip,
        seguro
      });
    }
    if (id_empresa) {
      const updateEmpresaRel = `
        MATCH (e:Empresa { id_empresa: $id_empresa })-[r:TIENE]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.status = COALESCE($status, r.status),
          r.cliente_vip = COALESCE($cliente_vip, r.cliente_vip),
          r.seguro = COALESCE($seguro, r.seguro)
        RETURN r
      `;
      await executeCypherQuery(updateEmpresaRel, {
        id_empresa,
        id_cuenta,
        status,
        cliente_vip,
        seguro
      });
    }

    // 4) Return updated
    const fetchUpdated = `
      MATCH (c:Cuenta { id_cuenta: $id_cuenta })
      RETURN c
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_cuenta });
    const updatedCuenta = result.records?.[0]?.get('c')?.properties;

    if (!updatedCuenta) {
      res.status(404).json({ message: 'Cuenta not found after update' });
    }

    res.status(200).json({
      message: 'Cuenta updated successfully',
      data: updatedCuenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Cuenta',
      error
    });
  }
};


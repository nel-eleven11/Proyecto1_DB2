// controllers/transacciones/update_transaction.ts
import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Transaccion } from '../../interfaces/nodeInterfaces';
import type { TarjetaRealizaTransaccionRel, DispositivoUsadoEnTransaccionRel, TransaccionDestinoCuentaRel } from '../../interfaces/relationshipInterfaces';

export const update_transaction: RequestHandler = async (req, res) => {
  try {
    const { id_transaccion } = req.params;

    // Node properties
    const {
      monto,
      moneda_tipo,
      fecha_hora,
      motivo
    } = req.body as Partial<Transaccion>;

    // Relationship props
    const {
      id_tarjeta,
      aprobada,
      tiempo_ejecucion,
      nit
    } = req.body as { id_tarjeta?: string } & Partial<TarjetaRealizaTransaccionRel>;

    const {
      id_dispositivo,
      conexion,
      ip_asociados,
      ubicacion
    } = req.body as { id_dispositivo?: string } & Partial<DispositivoUsadoEnTransaccionRel>;

    const {
      id_cuenta,
      tiempo_transferencia,
      confirmada_por_destino,
      internacional
    } = req.body as { id_cuenta?: string } & Partial<TransaccionDestinoCuentaRel>;

    // 1) Update node properties
    const updateNodeQuery = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      SET
        tx.monto = COALESCE($monto, tx.monto),
        tx.moneda_tipo = COALESCE($moneda_tipo, tx.moneda_tipo),
        tx.fecha_hora = COALESCE($fecha_hora, tx.fecha_hora),
        tx.motivo = COALESCE($motivo, tx.motivo)
      RETURN tx
    `;
    await executeCypherQuery(updateNodeQuery, {
      id_transaccion,
      monto,
      moneda_tipo,
      fecha_hora,
      motivo
    });

    // 2) Relationship updates. For example:
    if (id_tarjeta) {
      const updateTarjetaRel = `
        MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })-[r:REALIZA]->(tx:Transaccion { id_transaccion: $id_transaccion })
        SET
          r.aprobada = COALESCE($aprobada, r.aprobada),
          r.tiempo_ejecucion = COALESCE($tiempo_ejecucion, r.tiempo_ejecucion),
          r.nit = COALESCE($nit, r.nit)
        RETURN r
      `;
      await executeCypherQuery(updateTarjetaRel, {
        id_tarjeta,
        id_transaccion,
        aprobada,
        tiempo_ejecucion,
        nit
      });
    }
    if (id_dispositivo) {
      const updateDispoRel = `
        MATCH (d:Dispositivo { id_dispositivo: $id_dispositivo })-[r:USADO_EN]->(tx:Transaccion { id_transaccion: $id_transaccion })
        SET
          r.conexion = COALESCE($conexion, r.conexion),
          r.ip_asociados = COALESCE($ip_asociados, r.ip_asociados),
          r.ubicacion = COALESCE($ubicacion, r.ubicacion)
        RETURN r
      `;
      await executeCypherQuery(updateDispoRel, {
        id_dispositivo,
        id_transaccion,
        conexion,
        ip_asociados,
        ubicacion
      });
    }
    if (id_cuenta) {
      const updateCuentaRel = `
        MATCH (tx:Transaccion { id_transaccion: $id_transaccion })-[r:DESTINO]->(c:Cuenta { id_cuenta: $id_cuenta })
        SET
          r.tiempo_transferencia = COALESCE($tiempo_transferencia, r.tiempo_transferencia),
          r.confirmada_por_destino = COALESCE($confirmada_por_destino, r.confirmada_por_destino),
          r.internacional = COALESCE($internacional, r.internacional)
        RETURN r
      `;
      await executeCypherQuery(updateCuentaRel, {
        id_transaccion,
        id_cuenta,
        tiempo_transferencia,
        confirmada_por_destino,
        internacional
      });
    }

    // 3) Return updated
    const fetchUpdated = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      RETURN tx
    `;
    const result = await executeCypherQuery(fetchUpdated, { id_transaccion });
    const updatedTx = result.records?.[0]?.get('tx')?.properties;

    if (!updatedTx) {
      res.status(404).json({ message: 'Transaccion not found after update' });
    }

    res.status(200).json({
      message: 'Transaccion updated successfully (though it was meant immutable)',
      data: updatedTx
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating Transaccion',
      error
    });
  }
};


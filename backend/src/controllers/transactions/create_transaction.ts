// src/controllers/transacciones/create_transaction_fraud_check.ts
import type { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeCypherQuery } from '../../middleware/graphDBconnect';
import type { Transaccion } from '../../interfaces/nodeInterfaces';
import type { 
  TarjetaRealizaTransaccionRel, 
  DispositivoUsadoEnTransaccionRel, 
  TransaccionDestinoCuentaRel 
} from '../../interfaces/relationshipInterfaces';

export const create_transaction: RequestHandler = async (req, res) => {
  try {
    const id_transaccion = uuidv4();

    // Node properties from request
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

    // 1) MERGE the Transaction node with status = "On Hold"
    const mergeTxQuery = `
      MERGE (tx:Transaccion { id_transaccion: $id_transaccion })
      ON CREATE SET
        tx.monto = $monto,
        tx.moneda_tipo = $moneda_tipo,
        tx.fecha_hora = $fecha_hora,
        tx.motivo = $motivo,
        tx.status = "On Hold"
      RETURN tx
    `;

    await executeCypherQuery(mergeTxQuery, {
      id_transaccion,
      monto,
      moneda_tipo,
      fecha_hora,
      motivo
    });

    // 2) MERGE relationships if IDs provided
    if (id_tarjeta) {
      const mergeTarjetaRel = `
        MERGE (t:Tarjeta { id_tarjeta: $id_tarjeta })
        MERGE (tx:Transaccion { id_transaccion: $id_transaccion })
        MERGE (t)-[r:REALIZA]->(tx)
        ON CREATE SET
          r.aprobada = $aprobada,
          r.tiempo_ejecucion = $tiempo_ejecucion,
          r.nit = $nit
      `;
      await executeCypherQuery(mergeTarjetaRel, {
        id_tarjeta,
        id_transaccion,
        aprobada,
        tiempo_ejecucion,
        nit
      });
    }

    if (id_dispositivo) {
      const mergeDispoRel = `
        MERGE (d:Dispositivo { id_dispositivo: $id_dispositivo })
        MERGE (tx:Transaccion { id_transaccion: $id_transaccion })
        MERGE (d)-[r:USADO_EN]->(tx)
        ON CREATE SET
          r.conexion = $conexion,
          r.ip_asociados = $ip_asociados,
          r.ubicacion = $ubicacion
      `;
      await executeCypherQuery(mergeDispoRel, {
        id_dispositivo,
        id_transaccion,
        conexion,
        ip_asociados,
        ubicacion
      });
    }

    if (id_cuenta) {
      const mergeDestinoRel = `
        MERGE (tx:Transaccion { id_transaccion: $id_transaccion })
        MERGE (c:Cuenta { id_cuenta: $id_cuenta })
        MERGE (tx)-[r:DESTINO]->(c)
        ON CREATE SET
          r.tiempo_transferencia = $tiempo_transferencia,
          r.confirmada_por_destino = $confirmada_por_destino,
          r.internacional = $internacional
      `;
      await executeCypherQuery(mergeDestinoRel, {
        id_transaccion,
        id_cuenta,
        tiempo_transferencia,
        confirmada_por_destino,
        internacional
      });
    }

    // 3) Immediately check if suspicious (fraud detection).
    //    We'll do a simplified version of the 8-condition query. 
    //    If the transaction appears in that result, it's suspicious.
    const fraudCheckQuery = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      OPTIONAL MATCH (tx)-[dest:DESTINO]->(c:Cuenta)
      OPTIONAL MATCH (d:Dispositivo)-[used:USADO_EN]->(tx)
      OPTIONAL MATCH (t:Tarjeta)-[rel:REALIZA]->(tx)
      OPTIONAL MATCH (u:Usuario)-[prop:PROPIETARIO]->(t)
      WITH tx, c, dest, d, used, t, rel, u, prop

      WHERE
      (
        // (Same 8 conditions as before)
        (tx.monto > c.saldo) OR
        (dest.internacional = true AND (prop.membresia IS NULL OR NOT prop.membresia IN ["Gold","Platinum"])) OR
        (t.estado = "Bloqueada" AND rel.aprobada = true) OR
        (dest.confirmada_por_destino = false AND tx.monto > 0) OR
        (used.ubicacion = "HighRiskArea" OR ANY(ip IN used.ip_asociados WHERE ip STARTS WITH "192.168")) OR
        (
          dest.tiempo_transferencia < time("00:00:02") OR
          dest.tiempo_transferencia > time("03:00:00") OR
          rel.tiempo_ejecucion < 2 OR
          rel.tiempo_ejecucion > 10800
        ) OR
        (
          (c.estado = "Inactiva" OR 
           (c.fecha_cierre IS NOT NULL AND date(c.fecha_cierre) < date()))
          AND rel.aprobada = true
        ) OR
        (
          t.fecha_expiracion IS NOT NULL AND
          date(t.fecha_expiracion) < date() AND
          rel.aprobada = true
        )
      )
      RETURN tx
    `;
    const fraudResult = await executeCypherQuery(fraudCheckQuery, { id_transaccion });

    // If any record is returned => suspicious
    let finalStatus = 'Accepted';
    if (fraudResult.records.length > 0) {
      finalStatus = 'Rejected';
    }

    // 4) Set the final status
    const updateStatusQuery = `
      MATCH (tx:Transaccion { id_transaccion: $id_transaccion })
      SET tx.status = $finalStatus
      RETURN tx
    `;
    const statusResult = await executeCypherQuery(updateStatusQuery, {
      id_transaccion,
      finalStatus
    });

    const createdTx = statusResult.records?.[0]?.get('tx')?.properties;

    res.status(201).json({
      message: `Transaction created with final status: ${finalStatus}`,
      data: createdTx
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating transaction with fraud check',
      error
    });
  }
};


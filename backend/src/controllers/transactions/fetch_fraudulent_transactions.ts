import type { RequestHandler } from 'express';
import { executeCypherQuery } from '../../middleware/graphDBconnect';

/**
 * Fetches suspicious (potentially fraudulent) transactions based on the 8 conditions.
 * If an `id_tarjeta` is provided (e.g., /transactions/fraud?id_tarjeta=xxx),
 * then it only fetches suspicious transactions for that specific card.
 */
export const fetch_fraudulent_transactions: RequestHandler = async (req, res) => {
  try {
    const { id_tarjeta } = req.params; // or req.params, depending on your route design

    // We'll build a dynamic query to match all transactions.
    // If `id_tarjeta` is given, we anchor on that card.

    const mainMatch = id_tarjeta
      ? `
        MATCH (t:Tarjeta { id_tarjeta: $id_tarjeta })-[rel:REALIZA]->(tx:Transaccion)
        OPTIONAL MATCH (tx)-[dest:DESTINO]->(c:Cuenta)
        OPTIONAL MATCH (d:Dispositivo)-[used:USADO_EN]->(tx)
        OPTIONAL MATCH (u:Usuario)-[prop:PROPIETARIO]->(t)
      `
      : `
        MATCH (tx:Transaccion)
        OPTIONAL MATCH (tx)-[dest:DESTINO]->(c:Cuenta)
        OPTIONAL MATCH (d:Dispositivo)-[used:USADO_EN]->(tx)
        OPTIONAL MATCH (t:Tarjeta)-[rel:REALIZA]->(tx)
        OPTIONAL MATCH (u:Usuario)-[prop:PROPIETARIO]->(t)
      `;

    // The WHERE clause with our 8 suspicious conditions
    // Note: you may need to adjust date/time comparisons for your real environment.
    const whereClause = `
      WHERE
      (
        // 1) Transaction amount exceeds account balance
        (tx.monto > c.saldo) OR

        // 2) Transaction is international but user lacks VIP membership
        (dest.internacional = true AND (prop.membresia IS NULL OR NOT prop.membresia IN ["Gold","Platinum"])) OR

        // 3) The card is blocked but the transaction is "aprobada"
        (t.estado = "Bloqueada" AND rel.aprobada = true) OR

        // 4) Destination account hasn't confirmed but money is still subtracted
        (dest.confirmada_por_destino = false AND tx.monto > 0) OR

        // 5) Device used in high-risk location or suspicious IP
        (used.ubicacion = "HighRiskArea" OR ANY(ip IN used.ip_asociados WHERE ip STARTS WITH "192.168")) OR

        // 6) Abnormal transfer or execution times
        (
          dest.tiempo_transferencia < time("00:00:02") OR
          dest.tiempo_transferencia > time("03:00:00") OR
          rel.tiempo_ejecucion < 2 OR
          rel.tiempo_ejecucion > 10800
        ) OR

        // 7) Account is inactive/closed but transaction is "aprobada"
        (
          (c.estado = "Inactiva" OR
           (c.fecha_cierre IS NOT NULL AND date(c.fecha_cierre) < date()))
          AND rel.aprobada = true
        ) OR

        // 8) Card expiration is past but transaction is "aprobada"
        (
          t.fecha_expiracion IS NOT NULL AND
          date(t.fecha_expiracion) < date() AND
          rel.aprobada = true
        )
      )
    `;

    // Final return statement, we group them for clarity
    const returnClause = `
      RETURN
        tx AS SuspectTransaction,
        c   AS RelatedAccount,
        t   AS RelatedCard,
        d   AS RelatedDevice,
        u   AS CardOwner
    `;

    // Combine everything
    const cypherQuery = `
      ${mainMatch}
      WITH tx, c, dest, d, used, t, rel, u, prop
      ${whereClause}
      ${returnClause}
    `;

    // Build parameters object:
    const params: Record<string, any> = {};
    if (id_tarjeta) {
      params.id_tarjeta = id_tarjeta;
    }

    // Execute query
    const result = await executeCypherQuery(cypherQuery, params);

    // Map the results
    const frauds = result.records.map((record: any) => {
      return {
        transaction: record.get('SuspectTransaction')?.properties,
        account: record.get('RelatedAccount')?.properties,
        card: record.get('RelatedCard')?.properties,
        device: record.get('RelatedDevice')?.properties,
        cardOwner: record.get('CardOwner')?.properties
      };
    });

    res.status(200).json({
      message: 'Suspicious transactions fetched successfully',
      data: frauds
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch suspicious transactions',
      error
    });
  }
};


// src/interfaces/relationshipInterfaces.ts

//
// 1) (Usuario)-[:TIENE]->(Cuenta)
//
export interface UsuarioTieneCuentaRel {
  status: string;          // e.g. "activa", "inactiva", or custom
  cliente_vip: boolean;    // user is VIP or not
  seguro: boolean;         // account has insurance or not
}

//
// 2) (Transaccion)-[:DESTINO]->(Cuenta)
//
export interface TransaccionDestinoCuentaRel {
  tiempo_transferencia: string;     // or "time" type if you store it differently
  confirmada_por_destino: boolean;
  internacional: boolean;
}

//
// 3) (Banco)-[:PROVEE]->(Cuenta)
//
export interface BancoProveeCuentaRel {
  sucursal_origen: string;
  actividad_reciente: boolean;
  networking: boolean;
}

//
// 4) (Banco)-[:CONEXION_CON]->(Banco)
//   We'll include it for completeness, though you may or may not use it
//
export interface BancoConexionConBancoRel {
  tipo_conexion: string;
  monto_total_movido: number;
  frecuencia_transacciones: number;
}

//
// 5) (Empresa)-[:TIENE]->(Cuenta)
//
export interface EmpresaTieneCuentaRel {
  cliente_vip: boolean;
  status: string;
  seguro: boolean;
}

//
// 6) (Tarjeta)-[:ASOCIADA_A]->(Cuenta)
//
export interface TarjetaAsociadaACuentaRel {
  limite_credito: number;
  numero_de_uso: number;
  fecha_asociacion: string; // date as string or "YYYY-MM-DD"
}

//
// 7) (Dispositivo)-[:USADO_EN]->(Transaccion)
//
export interface DispositivoUsadoEnTransaccionRel {
  conexion: string;               // e.g. "WiFi", "Datos móviles"
  ip_asociados: string[];         // list of IP addresses
  ubicacion: string;              // geolocation info
}

//
// 8) (Tarjeta)-[:REALIZA]->(Transaccion)
//
export interface TarjetaRealizaTransaccionRel {
  aprobada: boolean;
  tiempo_ejecucion: number;  // in seconds
  nit: string;               // optional NIT associated to the transaction
}

//
// 9) (Usuario)-[:POSEE]->(Dispositivo)
//
export interface UsuarioPoseeDispositivoRel {
  huella_dactilar: boolean;
  reconocimiento_facial: boolean;
  ubicaciones: string[]; // list of places where the device was used
}

//
// 10) (Usuario)-[:PROPIETARIO]->(Tarjeta)
//
export interface UsuarioPropietarioTarjetaRel {
  chip: boolean;
  tiempo_de_uso: string;  // or "time" type if you handle it differently
  membresia: string;      // "Gold", "Platinum", etc.
}


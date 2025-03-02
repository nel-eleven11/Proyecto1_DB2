// src/interfaces/nodeInterfaces.ts

//
// A) Usuario
//
export interface Usuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // or Date
  telefono: string;
  email: string;
  pais: string;
  ciudad: string;
  nit: string;
  fecha_registro: string;   // or Date
}

//
// B) Cuenta
//
export interface Cuenta {
  id_cuenta: string;
  tipo: string;            // Ahorro, Corriente, etc.
  saldo: number;
  fecha_apertura: string;  // or Date
  fecha_cierre?: string;   // or Date, if closed
  estado: string;          // "Activa", "Inactiva", ...
}

//
// C) Banco
//
export interface Banco {
  id_banco: string;
  nombre: string;
  pais: string;
  direccion: string;
  telefono: string;
  sitio_web: string;
}

//
// D) Empresa
//
export interface Empresa {
  id_empresa: string;
  nombre: string;
  tipo: string;
  sector: string;
  pais: string;
  telefono: string;
  email: string;
  direccion: string;
}

//
// E) Tarjeta
//
export interface Tarjeta {
  id_tarjeta: string;
  tipo: string;              // Débito, Crédito
  contactless: boolean;
  marca: string;             // Visa, MasterCard
  fecha_expiracion: string;  // or Date
  estado: string;            // Activa, Bloqueada
  numero: string;
}

//
// F) Dispositivo
//
export interface Dispositivo {
  id_dispositivo: string;
  tipo: string;              // Móvil, Laptop, etc.
  marca: string;
  modelo: string;
  sistema_operativo: string;
  fecha_ultimo_uso: string;  // or datetime
}

//
// G) Transaccion
//
export interface Transaccion {
  id_transaccion: string;
  monto: number;
  moneda_tipo: string;   // e.g. "USD", "EUR"
  fecha_hora: string;    // datetime
  motivo: string;
  tipo?: string;         // The PDF does not mention 'tipo' for Transacción except in example. 
  // (If you want a "tipo" field for the transaction, add it here.)
}


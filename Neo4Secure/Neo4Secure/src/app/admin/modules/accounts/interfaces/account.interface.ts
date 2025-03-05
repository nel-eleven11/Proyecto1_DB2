export interface ICuenta {
  id_cuenta: string;
  tipo: string;
  saldo: number;
  fecha_apertura: string;
  fecha_cierre?: string;
  estado: string;

  // Campos opcionales para la relación con el Usuario
  id_usuario?: string;
  status?: string;
  cliente_vip?: boolean;
  seguro?: boolean;
}

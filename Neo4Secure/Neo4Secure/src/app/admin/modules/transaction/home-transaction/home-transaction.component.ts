import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
import { TransactionCrudService } from '../services/transactions-crud.service';


interface ITransaccion {
  // Ajusta según los campos reales de tu Transacción
  id_transaccion?: string;      // Si tu backend la tiene
  monto: number;
  moneda_tipo: string;
  fecha_hora: string;           // Guardaremos "YYYY-MM-DD HH:MM:SS"
  motivo: string;
}

@Component({
  selector: 'app-home-transaction',
  templateUrl: './home-transaction.component.html',
  styleUrls: ['./home-transaction.component.css']
})
export class HomeTransactionComponent implements OnInit {
  transacciones: ITransaccion[] = [];
  id_cuenta: string = '';

  // Variables para búsqueda, orden y paginación
  searchTerm: string = '';
  sortColumn: string = 'fecha_hora';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private transactionCrudService: TransactionCrudService
  ) {}

  ngOnInit(): void {
    // Obtenemos el id_cuenta desde la URL
    this.id_cuenta = localStorage.getItem('id_cuenta') || '';
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.loaderService.showLoader();
    this.transactionCrudService.listTransactionsByAccount(this.id_cuenta).subscribe({
      next: (resp) => {
        console.log('Transacciones:', resp);
        // Suponiendo que resp.transacciones es un array
        const rawTransacciones = resp.transacciones;

        // Parseamos cada transacción
        this.transacciones = rawTransacciones.map((tx: any) => ({
          monto: this.parseNeo4jNumber(tx.monto),
          moneda_tipo: tx.moneda_tipo || '',
          fecha_hora: this.parseNeo4jDateTime(tx.fecha_hora),
          motivo: tx.motivo || '',
          // Si tienes un campo ID real, úsalo:
          id_transaccion: tx.id_transaccion || ''
        }));

        this.loaderService.hideLoader();
        // Reiniciamos paginación y búsqueda
        this.currentPage = 1;
        this.searchTerm = '';
        this.sortColumn = 'fecha_hora';
        this.sortDirection = 'asc';
      },
      error: (err) => {
        console.error('Error al obtener transacciones:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // Helpers para parsear
  parseNeo4jNumber(value: any): number {
    // Si viene { low: number, high: 0 }
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (value.low !== undefined) {
      return value.low;
    }
    return 0;
  }

  parseNeo4jDateTime(dateTimeObj: any): string {
    // Si no viene nada, retorna vacío
    if (!dateTimeObj) return '';
    // Esperamos year, month, day, hour, minute, second
    const year = dateTimeObj.year?.low ?? dateTimeObj.year;
    const month = dateTimeObj.month?.low ?? dateTimeObj.month;
    const day = dateTimeObj.day?.low ?? dateTimeObj.day;
    const hour = dateTimeObj.hour?.low ?? dateTimeObj.hour;
    const minute = dateTimeObj.minute?.low ?? dateTimeObj.minute;
    const second = dateTimeObj.second?.low ?? dateTimeObj.second;

    if (!year || !month || !day) {
      return '';
    }

    // Aseguramos 2 dígitos
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const hourStr = (hour || 0).toString().padStart(2, '0');
    const minuteStr = (minute || 0).toString().padStart(2, '0');
    const secondStr = (second || 0).toString().padStart(2, '0');

    // Formato "YYYY-MM-DD HH:MM:SS"
    return `${year}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}:${secondStr}`;
  }

  // GETTER para filtrar, ordenar y paginar
  get displayedTransacciones(): ITransaccion[] {
    // 1) Filtrado local
    let filtered = this.transacciones.filter(tx =>
      this.matchesSearchTerm(tx, this.searchTerm)
    );

    // 2) Ordenar
    filtered.sort((a, b) => {
      const valA = (a as any)[this.sortColumn] || '';
      const valB = (b as any)[this.sortColumn] || '';
      return this.sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

    // 3) Paginación
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }

  matchesSearchTerm(tx: ITransaccion, term: string): boolean {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      (tx.id_transaccion || '').toLowerCase().includes(lowerTerm) ||
      (tx.moneda_tipo || '').toLowerCase().includes(lowerTerm) ||
      (tx.motivo || '').toLowerCase().includes(lowerTerm) ||
      (tx.fecha_hora || '').toLowerCase().includes(lowerTerm) ||
      tx.monto.toString().includes(lowerTerm)
    );
  }

  get totalPages(): number {
    const filtered = this.transacciones.filter(t => this.matchesSearchTerm(t, this.searchTerm));
    return Math.ceil(filtered.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fa-sort-asc' : 'fa-sort-desc';
    } else {
      return 'fa-sort';
    }
  }
}

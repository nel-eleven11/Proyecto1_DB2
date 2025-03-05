import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountCrudService } from '../services/accounts-crud.service';
import { LoaderService } from '../../../../services/loader.service';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { Router } from '@angular/router';

interface ICuenta {
  id_cuenta: string;
  tipo: string;
  saldo: number;
  fecha_apertura: string;
  fecha_cierre?: string;
  estado: string;
  // Campos extras que se pueden usar para relaciones
  id_usuario?: string;
  status?: string;
  cliente_vip?: boolean;
  seguro?: boolean;
}

@Component({
  selector: 'app-home-accounts',
  templateUrl: './home-accounts.component.html',
  styleUrls: ['./home-accounts.component.css']
})
export class HomeAccountsComponent implements OnInit {
  accounts: ICuenta[] = [];
  selectedUserId: string = 'US1';

  // Variables para búsqueda, orden y paginación
  searchTerm: string = '';
  sortColumn: string = 'tipo';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(
    private modalService: NgbModal,
    private accountCrudService: AccountCrudService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAccountsByUser();
  }

  goToCards(id_cuenta: string): void {
    // Navegamos a /admin/cards/:id_cuenta
    this.router.navigate(['admin/cards']);
    localStorage.setItem('id_cuenta', id_cuenta);
  }

  fetchAccountsByUser(): void {
    this.loaderService.showLoader();
    this.accountCrudService.listAccountsByUser(this.selectedUserId).subscribe({
      next: (response) => {
        console.log("Respuesta:", response);
        const rawAccounts = response.cuentas;
        this.accounts = rawAccounts.map((acc: any) => ({
          ...acc,
          saldo: this.parseNeo4jNumber(acc.saldo),
          fecha_apertura: this.parseDateOrString(acc.fecha_apertura),
          fecha_cierre: this.parseDateOrString(acc.fecha_cierre)
        }));
        this.loaderService.hideLoader();
        this.currentPage = 1;
        this.searchTerm = '';
        this.sortColumn = 'tipo';
        this.sortDirection = 'asc';
      },
      error: (err) => {
        console.error('Error al obtener cuentas:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // Abre el modal para crear una nueva cuenta. Se le pasa el id_usuario del input
  addAccount(): void {
    const modalRef = this.modalService.open(AccountModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = false;
    modalRef.componentInstance.id_usuario = this.selectedUserId;
    modalRef.result.then((result) => {
      if (result === 'created') {
        this.fetchAccountsByUser();
      }
    }).catch(() => {});
  }

  // Abre el modal para editar la cuenta seleccionada.
  editAccount(account: ICuenta): void {
    const modalRef = this.modalService.open(AccountModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.accountData = { ...account };
    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.fetchAccountsByUser();
      }
    }).catch(() => {});
  }

  // Elimina la cuenta y recarga la lista.
  deleteAccount(account: ICuenta): void {
    if (!confirm(`¿Deseas eliminar la cuenta ${account.id_cuenta}?`)) {
      return;
    }
    this.loaderService.showLoader();
    this.accountCrudService.deleteAccount(account.id_cuenta).subscribe({
      next: () => {
        alert(`Cuenta ${account.id_cuenta} eliminada con éxito`);
        this.fetchAccountsByUser();
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // Bloquea la cuenta (cambia estado a "Bloqueada")
  lockAccount(account: ICuenta): void {
    if (!confirm(`¿Deseas bloquear la cuenta ${account.id_cuenta}?`)) return;
    this.loaderService.showLoader();
    this.accountCrudService.lockAccount(account.id_cuenta).subscribe({
      next: () => {
        alert(`Cuenta ${account.id_cuenta} bloqueada con éxito`);
        this.fetchAccountsByUser();
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.error('Error al bloquear cuenta:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // Congela la cuenta (cambia estado a "Congelada")
  freezeAccount(account: ICuenta): void {
    if (!confirm(`¿Deseas congelar la cuenta ${account.id_cuenta}?`)) return;
    this.loaderService.showLoader();
    this.accountCrudService.freezeAccount(account.id_cuenta).subscribe({
      next: () => {
        alert(`Cuenta ${account.id_cuenta} congelada con éxito`);
        this.fetchAccountsByUser();
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.error('Error al congelar cuenta:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // Desbloquea la cuenta (cambia estado a "Activa")
  unlockAccount(account: ICuenta): void {
    if (!confirm(`¿Deseas desbloquear la cuenta ${account.id_cuenta}?`)) return;
    this.loaderService.showLoader();
    this.accountCrudService.unlockAccount(account.id_cuenta).subscribe({
      next: () => {
        alert(`Cuenta ${account.id_cuenta} desbloqueada con éxito`);
        this.fetchAccountsByUser();
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.error('Error al desbloquear cuenta:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // MÉTODOS AUXILIARES

  parseNeo4jNumber(neo4jNumber: any): number {
    if (!neo4jNumber) return 0;
    if (typeof neo4jNumber === 'number') return neo4jNumber;
    if (neo4jNumber.low !== undefined) {
      return neo4jNumber.low;
    }
    return 0;
  }

  /**
   * Si dateVal es un string, lo retorna tal cual.
   * Si es un objeto con year, month y day (formato Neo4j), lo formatea a "YYYY-MM-DD".
   */
  parseDateOrString(dateVal: any): string {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') return dateVal;
    if (dateVal.year && dateVal.month && dateVal.day) {
      const year = dateVal.year.low ?? dateVal.year;
      const month = dateVal.month.low ?? dateVal.month;
      const day = dateVal.day.low ?? dateVal.day;
      const monthStr = month.toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    }
    return '';
  }

  // GETTER para la tabla, que filtra, ordena y pagina la lista de cuentas.
  get displayedAccounts(): ICuenta[] {
    let filtered = this.accounts.filter(account =>
      this.matchesSearchTerm(account, this.searchTerm)
    );
    filtered.sort((a, b) => {
      const valA = (a as any)[this.sortColumn] || '';
      const valB = (b as any)[this.sortColumn] || '';
      return this.sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }

  matchesSearchTerm(account: ICuenta, term: string): boolean {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      (account.id_cuenta || '').toLowerCase().includes(lowerTerm) ||
      (account.tipo || '').toLowerCase().includes(lowerTerm) ||
      (account.estado || '').toLowerCase().includes(lowerTerm) ||
      (account.fecha_apertura || '').toLowerCase().includes(lowerTerm) ||
      (account.fecha_cierre || '').toLowerCase().includes(lowerTerm) ||
      `q${account.saldo}`.toLowerCase().includes(lowerTerm)
    );
  }

  get totalPages(): number {
    const filtered = this.accounts.filter(account =>
      this.matchesSearchTerm(account, this.searchTerm)
    );
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

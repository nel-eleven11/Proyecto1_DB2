import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../services/loader.service';
import { CardCrudService } from '../services/cards-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardModalComponent } from '../card-modal/card-modal.component';

interface ITarjeta {
  id_tarjeta: string;
  tipo: string;
  contactless: boolean;
  marca: string;
  fecha_expiracion: string;
  estado: string;
  numero: string;
}

@Component({
  selector: 'app-home-cards',
  templateUrl: './home-cards.component.html',
  styleUrls: ['./home-cards.component.css']
})
export class HomeCardsComponent implements OnInit {
  tarjetas: ITarjeta[] = [];
  id_cuenta: string = '';

  // Variables para búsqueda, orden y paginación
  searchTerm: string = '';
  sortColumn: string = 'tipo';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private cardCrudService: CardCrudService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.id_cuenta = localStorage.getItem('id_cuenta') || '';
    this.fetchCards();
  }

  fetchCards(): void {
    this.loaderService.showLoader();
    this.cardCrudService.listCardsByAccount(this.id_cuenta).subscribe({
      next: (resp) => {
        console.log('Tarjetas:', resp);
        // Suponiendo que el backend retorna { tarjetas: [...] }
        const rawTarjetas = resp.tarjetas;
        // Parseamos fecha_expiracion si viene en formato Neo4j
        this.tarjetas = rawTarjetas.map((t: any) => ({
          ...t,
          fecha_expiracion: this.parseDateOrString(t.fecha_expiracion)
        }));
        this.loaderService.hideLoader();
        // Reiniciar la paginación y la búsqueda
        this.currentPage = 1;
        this.searchTerm = '';
        this.sortColumn = 'tipo';
        this.sortDirection = 'asc';
      },
      error: (err) => {
        console.error('Error al obtener tarjetas:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['admin/transactions']);
  }

  // Botón "Nueva Tarjeta"
  addCard(): void {
    const modalRef = this.modalService.open(CardModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = false;
    modalRef.componentInstance.id_cuenta = this.id_cuenta; // Para asociar a la cuenta
    // modalRef.componentInstance.id_usuario = 'US1'; // si deseas asociar a un usuario
    modalRef.result.then((result) => {
      if (result === 'created') {
        this.fetchCards();
      }
    }).catch(() => {});
  }

  editCard(t: ITarjeta): void {
    const modalRef = this.modalService.open(CardModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.cardData = { ...t };
    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.fetchCards();
      }
    }).catch(() => {});
  }

  // Eliminar tarjeta
  deleteCard(tarjeta: ITarjeta): void {
    if (!confirm(`¿Deseas eliminar la tarjeta ${tarjeta.id_tarjeta}?`)) {
      return;
    }
    this.loaderService.showLoader();
    this.cardCrudService.deleteCard(tarjeta.id_tarjeta).subscribe({
      next: () => {
        alert(`Tarjeta ${tarjeta.id_tarjeta} eliminada con éxito`);
        this.fetchCards();
      },
      error: (err) => {
        console.error('Error al eliminar tarjeta:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // ================= MÉTODOS AUXILIARES =================

  /**
   * Si dateVal es string, lo retorna tal cual.
   * Si es un objeto con year, month, day, lo formatea "YYYY-MM-DD".
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

  // GETTER para la tabla (filtra, ordena, pagina)
  get displayedTarjetas(): ITarjeta[] {
    // 1) Filtrar
    let filtered = this.tarjetas.filter(t => this.matchesSearchTerm(t, this.searchTerm));

    // 2) Ordenar
    filtered.sort((a, b) => {
      const valA = (a as any)[this.sortColumn] || '';
      const valB = (b as any)[this.sortColumn] || '';
      if (this.sortDirection === 'asc') {
        return valA.toString().localeCompare(valB.toString());
      } else {
        return valB.toString().localeCompare(valA.toString());
      }
    });

    // 3) Paginación
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }

  matchesSearchTerm(t: ITarjeta, term: string): boolean {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      (t.id_tarjeta || '').toLowerCase().includes(lowerTerm) ||
      (t.tipo || '').toLowerCase().includes(lowerTerm) ||
      (t.marca || '').toLowerCase().includes(lowerTerm) ||
      (t.estado || '').toLowerCase().includes(lowerTerm) ||
      (t.fecha_expiracion || '').toLowerCase().includes(lowerTerm) ||
      (t.numero || '').toLowerCase().includes(lowerTerm)
    );
  }

  get totalPages(): number {
    const filtered = this.tarjetas.filter(t => this.matchesSearchTerm(t, this.searchTerm));
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

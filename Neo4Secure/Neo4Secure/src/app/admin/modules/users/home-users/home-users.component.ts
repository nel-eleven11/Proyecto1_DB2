import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { UserCrudService } from '../services/users-crud.service';
import { LoaderService } from '../../../../services/loader.service';

interface IUsuario {
  id_usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
  telefono: string;
  fecha_nacimiento?: string;
  nit?: string;
}

@Component({
  selector: 'app-home-users',
  templateUrl: './home-users.component.html',
  styleUrls: ['./home-users.component.css']
})
export class HomeUsersComponent implements OnInit {
  // Datos completos de usuarios
  users: IUsuario[] = [];

  // Variables para búsqueda, orden y paginación
  searchTerm: string = '';
  sortColumn: string = 'nombre';   // Campo por el que se ordena
  sortDirection: 'asc' | 'desc' = 'asc';  // Dirección de orden
  pageSize: number = 20;            // Cantidad de usuarios por página
  currentPage: number = 1;         // Página actual

  constructor(
    private userCrudService: UserCrudService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loaderService.showLoader();
    // Descargamos la lista de usuarios completa (sin paginación del backend)
    this.userCrudService.listUsers(9999, 0, 'nombre').subscribe({
      next: (response) => {
        this.users = response.data;
        console.log(response)
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  // GETTER: Retorna la lista final que se mostrará en la tabla
  get displayedUsers(): IUsuario[] {
    // 1) Filtrar por searchTerm
    let filtered = this.users.filter(user =>
      this.matchesSearchTerm(user, this.searchTerm)
    );

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

  // Método auxiliar para el filtrado
  matchesSearchTerm(user: IUsuario, term: string): boolean {
    if (!term) return true; // sin término => no filtra
    const lowerTerm = term.toLowerCase();
    // Verifica en varios campos
    return (
      user.nombre.toLowerCase().includes(lowerTerm) ||
      user.apellido.toLowerCase().includes(lowerTerm) ||
      user.email.toLowerCase().includes(lowerTerm) ||
      user.pais.toLowerCase().includes(lowerTerm) ||
      user.ciudad.toLowerCase().includes(lowerTerm) ||
      user.telefono.toLowerCase().includes(lowerTerm)
    );
  }

  // Paginación: total de páginas según el filtrado
  get totalPages(): number {
    // Filtra primero
    let filtered = this.users.filter(user =>
      this.matchesSearchTerm(user, this.searchTerm)
    );
    return Math.ceil(filtered.length / this.pageSize);
  }

  // Cambiar página
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
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Ordenar por columna
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // si es la misma columna, alterna asc/desc
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // si es columna nueva, setea asc por defecto
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


  // Abrir modal para crear un nuevo usuario
  addUser(): void {
    const modalRef = this.modalService.open(UserModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = false;
    modalRef.result.then((result) => {
      if (result === 'created') {
        this.fetchUsers();
      }
    }).catch(() => {});
  }

  // Abrir modal para editar usuario
  editUser(user: IUsuario): void {
    const modalRef = this.modalService.open(UserModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.userData = { ...user }; // Pasamos una copia
    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.fetchUsers();
      }
    }).catch(() => {});
  }

  // Eliminar usuario
  deleteUser(user: IUsuario): void {
    if (!confirm(`¿Deseas eliminar al usuario ${user.nombre} ${user.apellido}?`)) {
      return;
    }
    this.loaderService.showLoader();
    this.userCrudService.deleteUser(user.id_usuario).subscribe({
      next: () => {
        alert(`Usuario ${user.nombre} eliminado con éxito`);
        this.loaderService.hideLoader();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.loaderService.hideLoader();
      }
    });
  }
}

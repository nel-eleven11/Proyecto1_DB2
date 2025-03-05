import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userName: string = localStorage.getItem('userName') || 'Usuario';
  currentLanguage: string = 'Español';
  userMenuOpen: boolean = false;
  menuOpen: boolean = false;
  // Rol del usuario: 'admin' o 'user'
  role: string = localStorage.getItem('role') || 'admin';

  constructor(private router: Router) {}

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  switchLanguage(language: string): void {
    this.currentLanguage = language === 'es' ? 'Español' : 'English';
    localStorage.setItem('selectedLanguage', language);
    this.closeUserMenu();
  }

  onClickDashboard(): void {
    // Dashboard es visible para ambos roles
    if (this.role === 'admin') {
      this.router.navigate(['admin/dashboard']);
    } else if (this.role === 'user') {
      this.router.navigate(['neosec/dashboard']);
    }
  }

  onClickUsers(): void {
    // La opción de usuarios solo se muestra para admin
    this.router.navigate(['admin/users']);
  }

  onClickAccounts(): void {
    // Si es admin, navega a la sección de cuentas del módulo admin.
    // Si es user, navega a la sección de cuentas del módulo usuario (por ejemplo, /neosec/accounts)
    if (this.role === 'admin') {
      this.router.navigate(['admin/accounts']);
    } else if (this.role === 'user') {
      this.router.navigate(['neosec/accounts']);
    }
  }

  onClickPayment(): void {
    // Si es admin, podrías tener otra ruta (por ejemplo, /admin/payment).
    // Si es user, redirige a la opción de Realizar Pago en el módulo usuario.
    if (this.role === 'admin') {
      this.router.navigate(['admin/payment']);
    } else if (this.role === 'user') {
      this.router.navigate(['neosec/payment']);
    }
  }

  onClickSettings(): void {
    // Configuración puede ser común o diferenciada; aquí se redirige a la ruta de admin
    this.router.navigate(['admin/settings']);
  }

  logout(): void {
    alert('Cerrando sesión...');
    // Limpia los datos almacenados
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('selectedUserId');
    this.router.navigate(['/login']);
    this.closeUserMenu();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}

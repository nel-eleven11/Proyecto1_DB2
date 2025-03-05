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

  // Rol del usuario (admin o client)

  // O, si lo guardas en localStorage:
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
    console.log('Navegando a Dashboard');
    // Aquí puedes cerrar el menú, mostrar un alert, etc.
    this.router.navigate(['admin/dashboard']);
  }

  onClickUsers(): void {
    this.router.navigate(['admin/users']);
  }

  onClickAccounts(): void {
    this.router.navigate(['admin/accounts']);
  }

  onClickPayment(): void {
    // Funcionalidad de "Realizar pago"
    console.log('Navegando a realizar pago...');
    // this.router.navigate(['admin/payment']);
  }

  onClickSettings(): void {
    console.log('Navegando a Configuración');
    this.router.navigate(['admin/settings']);
  }

  logout(): void {
    alert('Cerrando sesión...');
    // Limpia localStorage si quieres
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);
    this.closeUserMenu();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}

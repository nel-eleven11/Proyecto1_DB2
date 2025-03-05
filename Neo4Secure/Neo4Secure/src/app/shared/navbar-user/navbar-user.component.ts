import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.css'
})
export class NavbarUserComponent {

  userName: string = localStorage.getItem('userName') || 'Usuario';
    currentLanguage: string = 'Español';
    userMenuOpen: boolean = false;
    menuOpen: boolean = false;

    // Rol del usuario (admin o client)

    // O, si lo guardas en localStorage:
    role: string = localStorage.getItem('role') || 'user';

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


    onClickAccounts(): void {
      this.router.navigate(['neosec/accounts']);
    }

    onClickPayment(): void {
      // Funcionalidad de "Realizar pago"
      this.router.navigate(['neosec/payments']);
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

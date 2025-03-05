import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  alertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType = 'alert-danger';
  alertIcon = 'icon-danger';
  currentLanguage: string;

  // Creamos el formulario
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private router: Router,
    public translate: TranslateService,
    private loaderService: LoaderService,
    private authService: AuthService // <-- Inyectamos el servicio
  ) {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    this.currentLanguage = savedLanguage;
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage);
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  login() {
    this.loaderService.showLoader();
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (response) => {
        console.log("Response: ", response);
        // Guardar token y rol en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userName', username!);

        if (response.role === 'user') {
          // Si el rol es user, asignamos selectedUserId = "US1" y redirigimos a /neosec
          localStorage.setItem('selectedUserId', 'US1');
          setTimeout(() => {
            this.loaderService.hideLoader();
            this.router.navigate(['/neosec']);
          }, 1500);
        } else {
          // Para admin, redirigimos a /admin/dashboard
          setTimeout(() => {
            this.loaderService.hideLoader();
            this.router.navigate(['/admin']);
          }, 1500);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loaderService.hideLoader();
        if (err.status === 401) {
          this.showAlert('Error', 'Credenciales inválidas', 'danger');
        } else {
          this.showAlert('Error', 'Ocurrió un error inesperado', 'danger');
        }
      }
    });
  }

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${
      type === 'success'
        ? 'check-circle'
        : type === 'danger'
        ? 'times-circle'
        : type === 'warning'
        ? 'exclamation-circle'
        : 'info-circle'
    }`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 5000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
    localStorage.setItem('selectedLanguage', language);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCrudService } from '../services/users-crud.service';
import { LoaderService } from '../../../../services/loader.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IUsuario } from '../interfaces/user.interface'; // Asegúrate de que id_usuario y fecha_registro sean opcionales

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() userData: IUsuario = {};

  userForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userCrudService: UserCrudService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // Crear el formulario con todos los campos obligatorios
    this.userForm = this.fb.group({
      nombre: [this.userData.nombre || '', [Validators.required]],
      apellido: [this.userData.apellido || '', [Validators.required]],
      email: [this.userData.email || '', [Validators.required, Validators.email]],
      pais: [this.userData.pais || ''],
      ciudad: [this.userData.ciudad || ''],
      telefono: [this.userData.telefono || ''],
      fecha_nacimiento: [this.userData.fecha_nacimiento || ''],
      nit: [this.userData.nit || '']
    });

    // Si es modo edición y existe fecha_registro, la agregamos y la bloqueamos
    if (this.isEditMode && this.userData.fecha_registro) {
      this.userForm.addControl(
        'fecha_registro',
        this.fb.control({ value: this.userData.fecha_registro, disabled: true })
      );
    }
  }

  save() {
    // Obtener el valor completo, incluidos los campos deshabilitados (como fecha_registro)
    const formValue = this.userForm.getRawValue() as Partial<IUsuario>;

    if (this.userForm.invalid) {
      this.showAlert('Por favor completa los campos obligatorios.');
      return;
    }

    this.loaderService.showLoader();

    // Modo Edición
    if (this.isEditMode && this.userData.id_usuario) {
      // Si por alguna razón no viene fecha_registro, lo asignamos desde el userData
      if (!formValue.fecha_registro && this.userData.fecha_registro) {
        formValue.fecha_registro = this.userData.fecha_registro;
      }
      this.userCrudService.updateUser(this.userData.id_usuario, formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al actualizar usuario', err);
          this.showAlert('Error al actualizar el usuario.');
        }
      });
    } else {
      // En modo creación, asignamos la fecha de registro actual
      formValue.fecha_registro = new Date().toISOString().split('T')[0];
      this.userCrudService.createUser(formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al crear usuario', err);
          this.showAlert('Error al crear el usuario.');
        }
      });
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }
}

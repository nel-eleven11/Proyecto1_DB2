import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountCrudService } from '../services/accounts-crud.service';
import { LoaderService } from '../../../../services/loader.service';
import { ICuenta } from '../interfaces/account.interface';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.css']
})
export class AccountModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() accountData: Partial<ICuenta> = {};
  // Recibiremos el id_usuario desde el componente padre para crear la cuenta
  @Input() id_usuario?: string;

  accountForm!: FormGroup;
  showWarningAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private accountCrudService: AccountCrudService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      // Para crear, estos campos son requeridos; en edición, puedes hacerlos opcionales si lo deseas
      tipo: [this.accountData.tipo || '', Validators.required],
      saldo: [this.accountData.saldo || 0, [Validators.required, Validators.min(0)]],
      // En edición, si ya existe la fecha, no se exige su llenado
      fecha_apertura: [this.accountData.fecha_apertura || '', this.isEditMode ? [] : [Validators.required]],
      fecha_cierre: [this.accountData.fecha_cierre || ''],
      estado: [this.accountData.estado || '', this.isEditMode ? [] : [Validators.required]],
      // Si no estás en edición, usaremos el id_usuario pasado; en edición, ya está en accountData si se desea
      id_usuario: [this.accountData['id_usuario'] || this.id_usuario || '', this.isEditMode ? [] : [Validators.required]]
    });

    // Si es modo edición y existe id_cuenta, la agregamos como control bloqueado
    if (this.isEditMode && this.accountData.id_cuenta) {
      this.accountForm.addControl(
        'id_cuenta',
        this.fb.control({ value: this.accountData.id_cuenta, disabled: true })
      );
    }
  }

  save(): void {
    if (this.accountForm.invalid) {
      this.showAlert('Por favor, complete los campos obligatorios.');
      return;
    }
    this.loaderService.showLoader();
    const formValue = this.accountForm.getRawValue() as Partial<ICuenta>;

    // Para la creación, establecemos valores por defecto para la relación
    if (!this.isEditMode) {
      formValue.status = 'Activa';
      formValue.cliente_vip = false;
      formValue.seguro = false;
    }

    if (this.isEditMode && this.accountData.id_cuenta) {
      this.accountCrudService.updateAccount(this.accountData.id_cuenta, formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al actualizar cuenta', err);
          this.showAlert('Error al actualizar la cuenta.');
        }
      });
    } else {
      this.accountCrudService.createAccount(formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al crear cuenta', err);
          this.showAlert('Error al crear la cuenta.');
        }
      });
    }
  }

  close(): void {
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

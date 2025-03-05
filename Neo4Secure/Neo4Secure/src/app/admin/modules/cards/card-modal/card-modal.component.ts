import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CardCrudService } from '../services/cards-crud.service';
import { LoaderService } from '../../../../services/loader.service';

interface ITarjeta {
  id_tarjeta: string;
  tipo: string;
  contactless: boolean;
  marca: string;
  fecha_expiracion: string;
  estado: string;
  numero: string;
  // Relación con la cuenta (sólo para crear)
  id_cuenta?: string;
  limite_credito?: number;
  numero_de_uso?: number;
  fecha_asociacion?: string;
}

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.css']
})
export class CardModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() cardData: Partial<ITarjeta> = {};
  // Recibimos el id_cuenta desde el Home (sólo se usa al crear)
  @Input() id_cuenta?: string;

  cardForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cardCrudService: CardCrudService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // Si es modo edición, los campos de relación con la cuenta no se mostrarán en el HTML.
    // Además, no serán obligatorios en modo edición.
    const requiredIfCreate = (validators: any[]) => this.isEditMode ? [] : validators;

    this.cardForm = this.fb.group({
      // Campos básicos de la tarjeta (obligatorios al crear)
      tipo: [
        this.cardData.tipo || '',
        requiredIfCreate([Validators.required])
      ],
      marca: [
        this.cardData.marca || '',
        requiredIfCreate([Validators.required])
      ],
      fecha_expiracion: [
        this.cardData.fecha_expiracion || '',
        requiredIfCreate([Validators.required])
      ],
      estado: [
        this.cardData.estado || '',
        requiredIfCreate([Validators.required])
      ],

      // Límite de crédito sólo aplica al crear (relación con la cuenta)
      limite_credito: [
        this.cardData.limite_credito || 0,
        requiredIfCreate([Validators.required])
      ],

      // Campos de relación con la cuenta, se usan sólo al crear
      id_cuenta: [
        this.cardData.id_cuenta || this.id_cuenta || '',
        requiredIfCreate([Validators.required])
      ],
      numero_de_uso: [
        this.cardData.numero_de_uso || 1
      ],
      fecha_asociacion: [
        this.cardData.fecha_asociacion || ''
      ]
    });

    // Si es edición y existe id_tarjeta, la agregamos y bloqueamos
    if (this.isEditMode && this.cardData.id_tarjeta) {
      this.cardForm.addControl(
        'id_tarjeta',
        this.fb.control({ value: this.cardData.id_tarjeta, disabled: true })
      );
    }
  }

  /** Genera un número de tarjeta aleatorio con formato XXXX-XXXX-XXXX-XXXX */
  private generateRandomCardNumber(): string {
    const generateBlock = (): string => Math.floor(1000 + Math.random() * 9000).toString();
    return `${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}`;
  }

  /** Devuelve la fecha de hoy en formato YYYY-MM-DD */
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  save(): void {
    if (this.cardForm.invalid) {
      this.showAlert('Por favor, completa los campos obligatorios.');
      return;
    }
    this.loaderService.showLoader();
    const formValue = this.cardForm.getRawValue();

    // En modo creación, asignamos los valores de relación y campos automáticos
    if (!this.isEditMode) {
      formValue.contactless = true;
      formValue.numero = this.generateRandomCardNumber();
      formValue.numero_de_uso = 1;
      formValue.fecha_asociacion = this.getTodayDate();
    } else {
      // Si es edición, removemos los campos de relación para no actualizarlos
      delete formValue.id_cuenta;
      delete formValue.limite_credito;
      delete formValue.numero_de_uso;
      delete formValue.fecha_asociacion;
    }

    // EDITAR
    if (this.isEditMode && this.cardData.id_tarjeta) {
      this.cardCrudService.updateCard(this.cardData.id_tarjeta, formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('updated');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al actualizar tarjeta', err);
          this.showAlert('Error al actualizar la tarjeta.');
        }
      });
    }
    // CREAR
    else {
      this.cardCrudService.createCard(formValue).subscribe({
        next: () => {
          this.loaderService.hideLoader();
          this.activeModal.close('created');
        },
        error: (err) => {
          this.loaderService.hideLoader();
          console.error('Error al crear tarjeta', err);
          this.showAlert('Error al crear la tarjeta.');
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

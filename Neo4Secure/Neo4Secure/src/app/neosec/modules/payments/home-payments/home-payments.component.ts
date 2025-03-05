import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '../../../../services/loader.service';
import { PaymentCrudService } from '../services/payments-crud.service';

@Component({
  selector: 'app-home-payments',
  templateUrl: './home-payments.component.html',
  styleUrls: ['./home-payments.component.css']
})
export class HomePaymentsComponent implements OnInit {
  paymentForm!: FormGroup;
  // Lista de cuentas del usuario
  accounts: any[] = [];
  // Obtenemos el id de usuario del localStorage (selectedUserId se guarda en el login para usuarios)
  selectedUserId: string = localStorage.getItem('selectedUserId') || 'US1';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentCrudService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      monto: [null, Validators.required],
      motivo: ['', Validators.required],
      id_cuenta: ['', Validators.required]
    });
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loaderService.showLoader();
    this.paymentService.listAccountsByUser(this.selectedUserId).subscribe({
      next: (response) => {
        // Se asume que el backend retorna { message, cuentas: [...] }
        this.accounts = response.cuentas;
        this.loaderService.hideLoader();
      },
      error: (err) => {
        console.error('Error al cargar cuentas:', err);
        this.loaderService.hideLoader();
      }
    });
  }

  submitPayment(): void {
    if (this.paymentForm.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const formValues = this.paymentForm.value;

    // Construir el objeto de transacción con datos "quemados" para la relación con la cuenta
    const transactionData = {
      // Datos del nodo Transacción
      monto: formValues.monto,
      motivo: formValues.motivo,
      moneda_tipo: "Q",
      fecha_hora: new Date().toISOString(),
      // Datos de la relación Transacción → Cuenta
      id_cuenta: formValues.id_cuenta,
      tiempo_transferencia: "00:00:05",  // Valor fijo
      confirmada_por_destino: true,       // Valor fijo
      internacional: false                // Valor fijo
    };

    this.loaderService.showLoader();
    this.paymentService.createTransaction(transactionData).subscribe({
      next: (resp) => {
        alert(`Transacción creada con estado: ${resp.data.status}`);
        this.loaderService.hideLoader();
        this.paymentForm.reset();
      },
      error: (err) => {
        console.error('Error al crear la transacción:', err);
        alert('Error al crear la transacción.');
        this.loaderService.hideLoader();
      }
    });
  }
}

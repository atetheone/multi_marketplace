import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { DeliveryPersonService } from '#shared/services/delivery-person.service';
import { ToastService } from '#shared/services/toast.service';
import { DeliveryPersonResponse } from '#core/types/delivery';
import { OrderResponse } from '#core/types/order';
import { Subject, takeUntil, finalize } from 'rxjs';

interface AssignDeliveryDialogData {
  order: OrderResponse;
  orderId?: number;
  zoneId?: number;
}

@Component({
  selector: 'app-assign-delivery-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './assign-delivery-dialog.component.html',
})
export class AssignDeliveryDialogComponent implements OnInit, OnDestroy {
  deliveryPersons: DeliveryPersonResponse[] = [];
  selectedDeliveryPersonId: number | null = null;
  isLoading = false;
  notes: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AssignDeliveryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignDeliveryDialogData,
    private deliveryPersonService: DeliveryPersonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryPersons();
  }

  loadDeliveryPersons(): void {
    this.isLoading = true;
    
    // If we have a zone ID, filter delivery persons by zone
    const zoneId = this.data.zoneId;
    
    this.deliveryPersonService.listDeliveryPersons(zoneId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.deliveryPersons = response.data.filter(dp => dp.isAvailable);
          
          if (this.deliveryPersons.length === 0) {
            this.toastService.warning('No available delivery persons found for this zone.');
          }
        },
        error: (error) => {
          console.error('Error loading delivery persons:', error);
          this.toastService.error('Failed to load delivery persons');
        }
      });
  }

  onSubmit(): void {
    if (!this.selectedDeliveryPersonId) {
      this.toastService.error('Please select a delivery person');
      return;
    }

    const orderId = this.data.order?.id || this.data.orderId;

    this.dialogRef.close({
      orderId: this.data.order.id,
      deliveryPersonId: this.selectedDeliveryPersonId,
      notes: this.notes || undefined
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
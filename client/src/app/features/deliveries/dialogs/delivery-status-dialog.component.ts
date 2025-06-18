import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { DeliveryResponse, DeliveryStatus } from '#core/types/delivery';
import { DeliveryStatusColorPipe } from '#pipes/delivery-status-color.pipe';

interface DeliveryStatusDialogData {
  delivery: DeliveryResponse;
  currentStatus: string;
}

@Component({
  selector: 'app-delivery-status-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    // DeliveryStatusColorPipe
  ],
  templateUrl: './delivery-status-dialog.component.html'
})
export class DeliveryStatusDialogComponent {
  notes: string = '';
  selectedStatus: DeliveryStatus;
  deliveryStatusEnum = DeliveryStatus;
  availableStatuses: {value: DeliveryStatus, label: string}[] = [];
  
  constructor(
    private dialogRef: MatDialogRef<DeliveryStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryStatusDialogData
  ) {
    this.selectedStatus = this.data.currentStatus as DeliveryStatus;
    this.setAvailableStatuses();
  }

  private setAvailableStatuses(): void {
    const currentStatus = this.data.currentStatus as DeliveryStatus;
    
    // Define possible status transitions based on current status
    switch (currentStatus) {
      case DeliveryStatus.PENDING:
      case DeliveryStatus.ASSIGNED:
        this.availableStatuses = [
          { value: DeliveryStatus.SHIPPED, label: 'Shipped' },
          { value: DeliveryStatus.CANCELLED, label: 'Cancelled' }
        ];
        break;
      case DeliveryStatus.SHIPPED:
        this.availableStatuses = [
          { value: DeliveryStatus.DELIVERED, label: 'Delivered to Customer' },
          { value: DeliveryStatus.RETURNED, label: 'Returned to Store' },
          { value: DeliveryStatus.CANCELLED, label: 'Cancelled' }
        ];
        break;
      case DeliveryStatus.DELIVERED:
      case DeliveryStatus.RETURNED:
      case DeliveryStatus.CANCELLED:
        this.availableStatuses = [];
        break;
    }
  }

  onSubmit(): void {
    this.dialogRef.close({
      status: this.selectedStatus,
      notes: this.notes || undefined
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { DeliveryService } from '#shared/services/delivery.service';
import { ToastService } from '#shared/services/toast.service';
import { AuthService } from '#core/services/auth.service';
import { DeliveryResponse, DeliveryStatus } from '#core/types/delivery';
import { DeliveryStatusColorPipe } from '#pipes/delivery-status-color.pipe';
import { DeliveryStatusDialogComponent } from '../dialogs/delivery-status-dialog.component';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-my-deliveries',
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    DeliveryStatusColorPipe
  ],
  templateUrl: './my-deliveries.component.html',
  styleUrl: './my-deliveries.component.sass'
})
export class MyDeliveriesComponent implements OnInit, OnDestroy {
  activeDeliveries: DeliveryResponse[] = [];
  completedDeliveries: DeliveryResponse[] = [];
  isLoading = false;
  
  displayedColumns: string[] = ['orderId', 'customer', 'address', 'status', 'assignedAt', 'actions'];
  deliveryStatusEnum = DeliveryStatus;
  
  private destroy$ = new Subject<void>();

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMyDeliveries();
  }

  loadMyDeliveries(): void {
    this.isLoading = true;
    
    this.deliveryService.getMyDeliveries()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          const allDeliveries = response.data;
          this.activeDeliveries = allDeliveries.filter(d => 
            d.status === DeliveryStatus.ASSIGNED || 
            d.status === DeliveryStatus.SHIPPED
          );
          this.completedDeliveries = allDeliveries.filter(d => 
            d.status === DeliveryStatus.DELIVERED || 
            d.status === DeliveryStatus.RETURNED || 
            d.status === DeliveryStatus.CANCELLED
          );
        },
        error: (error) => {
          console.error('Error loading deliveries:', JSON.stringify(error, null, 2));
          this.toastService.error('Failed to load deliveries');
        }
      });
  }

  updateDeliveryStatus(delivery: DeliveryResponse): void {
    const dialogRef = this.dialog.open(DeliveryStatusDialogComponent, {
      width: '500px',
      data: {
        delivery,
        currentStatus: delivery.status
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.deliveryService.updateDeliveryStatus(delivery.id, result.status, result.notes)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.isLoading = false)
          )
          .subscribe({
            next: (response) => {
              this.toastService.success(`Delivery status updated to ${result.status}`);
              this.loadMyDeliveries();  // Reload deliveries to reflect changes
            },
            error: (error) => {
              console.error('Error updating delivery status:', error);
              this.toastService.error('Failed to update delivery status');
            }
          });
      }
    });
  }

  getNextActionLabel(status: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.ASSIGNED:
        return 'Mark as Shipped';
      case DeliveryStatus.SHIPPED:
        return 'Mark as Delivered';
      default:
        return 'Update Status';
    }
  }

  canUpdateStatus(status: DeliveryStatus): boolean {
    return status === DeliveryStatus.ASSIGNED || status === DeliveryStatus.SHIPPED;
  }

  refreshDeliveries(): void {
    this.loadMyDeliveries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { DeliveryService } from '#shared/services/delivery.service';
import { ToastService } from '#shared/services/toast.service';
import { DeliveryResponse, DeliveryStatus } from '#core/types/delivery';
import { DeliveryStatusColorPipe } from '#pipes/delivery-status-color.pipe';
import { DeliveryStatusDialogComponent } from '../../dialogs/delivery-status-dialog.component';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-delivery-detail',
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    DeliveryStatusColorPipe
  ],
  templateUrl: './delivery-detail.component.html',
  // styleUrl: './delivery-detail.component.sass'
})
export class DeliveryDetailComponent implements OnInit, OnDestroy {
  deliveryId!: number;
  delivery?: DeliveryResponse;
  isLoading = false;
  deliveryStatusEnum = DeliveryStatus;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deliveryService: DeliveryService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.deliveryId = +params['id'];
      this.loadDeliveryDetails();
    });
  }

  loadDeliveryDetails(): void {
    this.isLoading = true;
    this.deliveryService.getDeliveryDetails(this.deliveryId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.delivery = response.data;
        },
        error: (error) => {
          console.error('Error loading delivery details:', error);
          this.toastService.error('Failed to load delivery details');
          this.router.navigate(['/dashboard/deliveries']);
        }
      });
  }

  openStatusUpdateDialog(): void {
    if (!this.delivery) return;

    const dialogRef = this.dialog.open(DeliveryStatusDialogComponent, {
      width: '500px',
      data: {
        delivery: this.delivery,
        currentStatus: this.delivery.status
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateDeliveryStatus(result.status, result.notes);
      }
    });
  }

  updateDeliveryStatus(status: DeliveryStatus, notes?: string): void {
    this.isLoading = true;
    this.deliveryService.updateDeliveryStatus(this.deliveryId, status, notes)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.delivery = response.data;
          this.toastService.success(`Delivery status updated to ${status}`);
        },
        error: (error) => {
          console.error('Error updating delivery status:', error);
          this.toastService.error('Failed to update delivery status');
        }
      });
  }

  getStatusTimestamp(status: DeliveryStatus): string | null {
    if (!this.delivery) return null;

    switch (status) {
      case DeliveryStatus.ASSIGNED:
        return this.delivery.assignedAt || null;
      case DeliveryStatus.SHIPPED:
        return this.delivery.shippedAt || null;
      case DeliveryStatus.DELIVERED:
        return this.delivery.deliveredAt || null;
      default:
        return null;
    }
  }

  canUpdateStatus(): boolean {
    if (!this.delivery) return false;
    
    return this.delivery.status !== DeliveryStatus.DELIVERED && 
           this.delivery.status !== DeliveryStatus.CANCELLED;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DeliveryPersonService } from '#shared/services/delivery-person.service';
import { ZoneService } from '#shared/services/zone.service';
import { DeliveryPersonResponse, VehicleType } from '#types/delivery';
import { DeliveryZoneResponse } from '#types/zone';
import { ToastService } from '#shared/services/toast.service';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { DeliveryPersonDialogComponent } from '../dialogs/delivery-person-dialog.component';

@Component({
  selector: 'app-delivery-person-list',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './delivery-person-list.component.html',
  styleUrl: './delivery-person-list.component.sass',
})
export class DeliveryPersonListComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<DeliveryPersonResponse>([]);
  displayedColumns: string[] = [
    'name',
    'vehicleType',
    'isAvailable',
    'rating',
    'completedDeliveries',
    'zones',
    'actions'
  ];
  isLoading = true;
  zones: DeliveryZoneResponse[] = [];
  selectedZoneId: number | null = null;
  VehicleType = VehicleType;
  private destroy$ = new Subject<void>();

  constructor(
    private deliveryPersonService: DeliveryPersonService,
    private zoneService: ZoneService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadZones();
    this.loadDeliveryPersons();
  }

  loadZones(): void {
    this.zoneService.getZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (zones) => {
          this.zones = zones;
        },
        error: (error) => {
          console.error('Error loading zones:', error);
          this.toastService.error('Failed to load delivery zones');
        }
      });
  }

  loadDeliveryPersons(zoneId?: number): void {
    this.isLoading = true;
    this.deliveryPersonService.listDeliveryPersons(zoneId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading delivery persons:', error);
          this.toastService.error('Failed to load delivery personnel');
          this.isLoading = false;
        }
      });
  }

  filterByZone(): void {
    this.loadDeliveryPersons(this.selectedZoneId || undefined);
  }

  clearZoneFilter(): void {
    this.selectedZoneId = null;
    this.loadDeliveryPersons();
  }

  createNewDeliveryPerson(): void {
    const dialogRef = this.dialog.open(DeliveryPersonDialogComponent, {
      width: '800px',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.toastService.success('Delivery person created successfully');
        this.loadDeliveryPersons(this.selectedZoneId || undefined);
      } else if (result && !result.success) {
        this.toastService.error('Failed to create delivery person');
      }
    });
  }

  editDeliveryPerson(id: number): void {
    this.isLoading = true;
    this.deliveryPersonService.getDeliveryPerson(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(DeliveryPersonDialogComponent, {
            width: '800px',
            data: { 
              isEditMode: true,
              deliveryPerson: response.data
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
              this.toastService.success('Delivery person updated successfully');
              this.loadDeliveryPersons(this.selectedZoneId || undefined);
            } else if (result && !result.success) {
              this.toastService.error('Failed to update delivery person');
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching delivery person:', error);
          this.toastService.error('Failed to load delivery person details');
        }
      });
  }

  toggleAvailability(deliveryPerson: DeliveryPersonResponse): void {
    const newStatus = !deliveryPerson.isAvailable;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${newStatus ? 'Activate' : 'Deactivate'} Delivery Person`,
        message: `Are you sure you want to ${newStatus ? 'mark as available' : 'mark as unavailable'} ${deliveryPerson.user.firstName} ${deliveryPerson.user.lastName}?`,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliveryPersonService.toggleAvailability(newStatus)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.toastService.success(`Delivery person ${newStatus ? 'activated' : 'deactivated'} successfully`);
              this.loadDeliveryPersons(this.selectedZoneId || undefined);
            },
            error: (error) => {
              console.error('Error toggling availability:', error);
              this.toastService.error('Failed to update delivery person availability');
            }
          });
      }
    });
  }

  viewDeliveryHistory(id: number): void {
    // This would typically navigate to a delivery history view
    // For now, we'll just show a message
    this.toastService.info('Delivery history view not implemented yet');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getZoneNames(zones: DeliveryZoneResponse[]): string {
    if (!zones || zones.length === 0) {
      return 'None';
    }
    return zones.map(zone => zone.name).join(', ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
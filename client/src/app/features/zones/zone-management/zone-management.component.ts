import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '#shared/material/material.module';
import { ZoneService } from '#shared/services/zone.service';
import { DeliveryPersonService } from '#shared/services/delivery-person.service';
import { ToastService } from '#shared/services/toast.service';
import { CreateZoneDto, DeliveryZoneResponse } from '#types/zone';
import { BehaviorSubject, finalize } from 'rxjs';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ZoneDialogComponent } from '../zone-dialog/zone-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-zone-management',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './zone-management.component.html',
  styleUrl: './zone-management.component.sass'
})
export class ZoneManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'fee', 'deliveryPersons', 'actions'];
  dataSource: MatTableDataSource<DeliveryZoneResponse>;
  loading$ = new BehaviorSubject<boolean>(true);
  totalZones = 0;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private zoneService: ZoneService,
    private deliveryPersonService: DeliveryPersonService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.dataSource = new MatTableDataSource<DeliveryZoneResponse>([]);
  }
  
  ngOnInit(): void {
    this.loadZones();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  loadZones(): void {
    this.loading$.next(true);
    this.zoneService.getZones().pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe({
      next: (zones) => {
        this.dataSource.data = zones;
        this.totalZones = zones.length;
      },
      error: (error) => {
        this.toastService.error('Failed to load delivery zones');
        console.error('Error loading zones:', error);
      }
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  openZoneDialog(zone?: DeliveryZoneResponse): void {
    const dialogRef = this.dialog.open(ZoneDialogComponent, {
      width: '500px',
      data: { zone }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (zone) {
          // Update existing zone
          this.updateZone(zone.id, result);
        } else {
          // Create new zone
          this.createZone(result);
        }
      }
    });
  }
  
  createZone(zoneData: CreateZoneDto): void {
    this.loading$.next(true);
    this.zoneService.createZone(zoneData).pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe({
      next: () => {
        this.toastService.success('Delivery zone created successfully');
        this.loadZones();
      },
      error: (error) => {
        this.toastService.error('Failed to create delivery zone');
        console.error('Error creating zone:', error);
      }
    });
  }
  
  updateZone(zoneId: number, zoneData: CreateZoneDto): void {
    this.loading$.next(true);
    this.zoneService.updateZone(zoneId, zoneData).pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe({
      next: () => {
        this.toastService.success('Delivery zone updated successfully');
        this.loadZones();
      },
      error: (error) => {
        this.toastService.error('Failed to update delivery zone');
        console.error('Error updating zone:', error);
      }
    });
  }
  
  confirmDeleteZone(zone: DeliveryZoneResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Delivery Zone',
        message: `Are you sure you want to delete the zone "${zone.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteZone(zone.id);
      }
    });
  }
  
  deleteZone(zoneId: number): void {
    this.loading$.next(true);
    this.zoneService.deleteZone(zoneId).pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe({
      next: () => {
        this.toastService.success('Delivery zone deleted successfully');
        this.loadZones();
      },
      error: (error) => {
        this.toastService.error('Failed to delete delivery zone');
        console.error('Error deleting zone:', error);
      }
    });
  }
  
  getDeliveryPersonsCount(zone: DeliveryZoneResponse): number {
    return 0;
  }
}
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { MaterialModule } from '#shared/material/material.module';
import { DeliveryService } from '#shared/services/delivery.service';
import { OrderService } from '#shared/services/order.service';
import { ToastService } from '#shared/services/toast.service';
import { DeliveryResponse } from '#types/delivery';
import { OrderResponse } from '#types/order';
import { AssignDeliveryDialogComponent } from '../dialogs/assign-delivery-dialog.component';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-deliveries-dashboard',
  imports: [
    CommonModule, 
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './deliveries-dashboard.component.html',
  styleUrl: './deliveries-dashboard.component.sass'
})
export class DeliveriesDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Table data
  displayedColumns: string[] = ['id', 'order', 'status', 'assignedTo', 'assignedAt', 'pickedAt', 'deliveredAt', 'actions'];
  dataSource = new MatTableDataSource<DeliveryResponse>([]);
  
  // Orders that need delivery assignment
  pendingOrders: OrderResponse[] = [];
  
  // Loading state
  loading = new BehaviorSubject<boolean>(false);
  
  // Filters
  filterForm: FormGroup;
  deliveryStatusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked', label: 'Picked Up' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' }
  ];
  
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      dateFrom: [null],
      dateTo: [null]
    });
  }
  
  ngOnInit(): void {
    this.loadData();
    this.setupFilterListeners();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  loadData(): void {
    this.loading.next(true);
    
    // Get both pending orders and deliveries
    forkJoin({
      deliveries: this.deliveryService.getDeliveries(/*this.getFilters()*/),
      pendingOrders: this.orderService.getPendingOrders()
    }).pipe(
      finalize(() => this.loading.next(false))
    ).subscribe({
      next: (result) => {
        // Set deliveries to table
        this.dataSource.data = result.deliveries || [];
        
        // Set pending orders
        this.pendingOrders = result.pendingOrders || [];
      },
      error: (error) => {
        this.toastService.error('Failed to load deliveries data');
        console.error('Error loading deliveries data:', error);
      }
    });
  }
  
  setupFilterListeners(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.loadData();
    });
  }
  
  getFilters(): any {
    const filters = { ...this.filterForm.value };
    
    // Format dates if they exist
    if (filters.dateFrom) {
      filters.dateFrom = filters.dateFrom.toISOString().split('T')[0];
    }
    
    if (filters.dateTo) {
      filters.dateTo = filters.dateTo.toISOString().split('T')[0];
    }
    
    return filters;
  }
  
  resetFilters(): void {
    this.filterForm.reset({
      status: '',
      dateFrom: null,
      dateTo: null
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  openAssignDeliveryDialog(order: OrderResponse): void {
    const dialogRef = this.dialog.open(AssignDeliveryDialogComponent, {
      width: '500px',
      data: { order }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliveryService.assignDelivery(result).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.toastService.success('Delivery assigned successfully');
            this.loadData();
          },
          error: (error) => {
            this.toastService.error('Failed to assign delivery');
            console.error('Error assigning delivery:', error);
          }
        });
      }
    });
  }
  
  updateDeliveryStatus(deliveryId: number, status: string): void {
    // First, confirm with the user
    const statusMap: Record<string, string> = {
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Update Delivery Status',
        message: `Are you sure you want to mark this delivery as ${statusMap[status]}?`,
        confirmText: 'Yes, Update',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading.next(true);
        
        this.deliveryService.updateDeliveryStatus(deliveryId, status).pipe(
          finalize(() => this.loading.next(false)),
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.toastService.success(`Delivery status updated to ${statusMap[status]}`);
            this.loadData();
          },
          error: (error) => {
            this.toastService.error('Failed to update delivery status');
            console.error('Error updating delivery status:', error);
          }
        });
      }
    });
  }
  
  viewDeliveryDetails(deliveryId: number): void {
    this.router.navigate(['/dashboard/deliveries/tracking', deliveryId]);
  }
  
  navigateToPersons(): void {
    this.router.navigate(['/dashboard/deliveries/deliveries-persons']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
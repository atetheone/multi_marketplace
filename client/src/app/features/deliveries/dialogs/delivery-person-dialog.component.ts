import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { MaterialModule } from '#shared/material/material.module'
import { DeliveryPersonService } from '#shared/services/delivery-person.service';
import { ZoneService } from '#shared/services/zone.service';
import { UserService } from '#shared/services/user.service';
import { DeliveryZoneResponse } from '#types/zone';
import { DeliveryPersonResponse, VehicleType } from '#types/delivery';
import { UserResponse } from '#types/user';

export interface DeliveryPersonDialogData {
  deliveryPerson?: DeliveryPersonResponse;
  isEditMode: boolean;
}

@Component({
  selector: 'app-delivery-person-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './delivery-person-dialog.component.html',
  styleUrl: './delivery-person-dialog.component.sass'
})
export class DeliveryPersonDialogComponent implements OnInit, OnDestroy {
  deliveryPersonForm!: FormGroup;
  vehicleTypes = Object.values(VehicleType);
  zones: DeliveryZoneResponse[] = [];
  eligibleUsers: UserResponse[] = [];
  isLoading = true;
  isSubmitting = false;
  VehicleType = VehicleType;
  today = new Date();
  minExpiryDate = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeliveryPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryPersonDialogData,
    private deliveryPersonService: DeliveryPersonService,
    private zoneService: ZoneService,
    private userService: UserService
  ) {
    // Set minimum expiry date to today + 30 days
    this.minExpiryDate.setDate(this.minExpiryDate.getDate() + 30);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();
  }

  initForm(): void {
    this.deliveryPersonForm = this.fb.group({
      userId: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      vehiclePlateNumber: ['', [Validators.required]],
      vehicleModel: [''],
      vehicleYear: [null],
      licenseNumber: ['', [Validators.required]],
      licenseExpiry: ['', [Validators.required]],
      licenseType: [''],
      zoneIds: [[], [Validators.required]],
      isActive: [true],
      isAvailable: [true]
    });

    if (this.data.isEditMode && this.data.deliveryPerson) {
      this.populateForm(this.data.deliveryPerson);
    }
  }

  loadFormData(): void {
    this.isLoading = true;
    
    forkJoin({
      zones: this.zoneService.getZones(),
      users: this.userService.getUsersWithRole('delivery-person') // returns UserResponse[]
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (result) => {
        this.zones = result.zones;
        this.eligibleUsers = result.users;
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.dialogRef.close({ success: false, error });
      }
    });
  }

  populateForm(deliveryPerson: DeliveryPersonResponse): void {
    this.deliveryPersonForm.patchValue({
      userId: deliveryPerson.userId,
      vehicleType: deliveryPerson.vehicleType,
      vehiclePlateNumber: deliveryPerson.vehiclePlateNumber,
      vehicleModel: deliveryPerson.vehicleModel,
      vehicleYear: deliveryPerson.vehicleYear,
      licenseNumber: deliveryPerson.licenseNumber,
      licenseExpiry: new Date(deliveryPerson.licenseExpiry),
      licenseType: deliveryPerson.licenseType,
      zoneIds: deliveryPerson.zones.map(zone => zone.id),
      isActive: deliveryPerson.isActive,
      isAvailable: deliveryPerson.isAvailable
    });
    
    // Disable userId field in edit mode
    this.deliveryPersonForm.get('userId')?.disable();
  }

  onSubmit(): void {
    if (this.deliveryPersonForm.invalid) {
      this.markFormGroupTouched(this.deliveryPersonForm);
      return;
    }

    this.isSubmitting = true;
    const formValue = { ...this.deliveryPersonForm.value };
    
    // Format the date for backend
    if (formValue.licenseExpiry instanceof Date) {
      formValue.licenseExpiry = formValue.licenseExpiry.toISOString().split('T')[0];
    }
    
    if (this.data.isEditMode && this.data.deliveryPerson) {
      const id = this.data.deliveryPerson.id;
      this.deliveryPersonService.updateDeliveryPerson(id, formValue)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close({ success: true, data: response.data });
          },
          error: (error) => {
            console.error('Error updating delivery person:', error);
            this.dialogRef.close({ success: false, error });
          }
        });
    } else {
      this.deliveryPersonService.createDeliveryPerson(formValue)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close({ success: true, data: response.data });
          },
          error: (error) => {
            console.error('Error creating delivery person:', error);
            this.dialogRef.close({ success: false, error });
          }
        });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
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
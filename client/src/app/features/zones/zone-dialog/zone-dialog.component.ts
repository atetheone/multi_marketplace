import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { DeliveryZoneResponse } from '#types/zone';

interface ZoneDialogData {
  zone?: DeliveryZoneResponse;
}

@Component({
  selector: 'app-zone-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule
  ],
  templateUrl: './zone-dialog.component.html',
  styleUrl: './zone-dialog.component.sass'
})
export class ZoneDialogComponent implements OnInit {
  zoneForm!: FormGroup;
  isEditMode: boolean;
  dialogTitle: string;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ZoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ZoneDialogData
  ) {
    this.isEditMode = !!data.zone;
    this.dialogTitle = this.isEditMode ? 'Edit Delivery Zone' : 'Create Delivery Zone';
  }
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.zoneForm = this.fb.group({
      name: [this.data.zone?.name || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      fee: [this.data.zone?.fee || 0, [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]]
    });
  }
  
  onSubmit(): void {
    if (this.zoneForm.valid) {
      const formValue = this.zoneForm.value;
      
      // Convert fee to number to ensure proper type
      formValue.fee = Number(formValue.fee);
      
      this.dialogRef.close(formValue);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
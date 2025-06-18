import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { PermissionResponse } from '#types/permission';
import { ResourceResponse } from '#types/resource';
import { ResourceService } from '#services/resource.service';
import { BehaviorSubject } from 'rxjs';
import { DataState } from '#types/data_state';

interface DialogData {
  permission?: PermissionResponse;
  mode: 'create' | 'edit';
}

interface DialogState extends DataState<ResourceResponse[]> {
  data?: ResourceResponse[];
}

@Component({
  selector: 'app-permission-dialog',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="min-w-[400px]">
      <h2 mat-dialog-title>
        {{ data.mode === 'create' ? 'Create' : 'Edit' }} Permission
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @if (state$ | async; as state) {
          <mat-dialog-content class="flex flex-col gap-4 py-4">
            @switch (state.status) { 
              @case ('loading') {
                <div class="flex justify-center">
                  <mat-spinner diameter="30"></mat-spinner>
                </div>
              } @case ('error') {
                <mat-error class="mb-4">{{ state.error }}</mat-error>
              } @case ('success') {
                <!-- Resource Selection -->
                <mat-form-field appearance="outline">
                  <mat-label>Resource</mat-label>
                  <mat-select formControlName="resourceId">
                    @for (resource of state.data; track resource.id) {
                      <mat-option [value]="resource.id">
                        {{ resource.name }}
                      </mat-option>
                    }
                  </mat-select>
                  @if (form.get('resource')?.hasError('required') &&
                    form.get('resource')?.touched) {
                    <mat-error>Resource is required</mat-error>
                  }
                </mat-form-field>

                <!-- Action Selection -->
                <mat-form-field appearance="outline">
                  <mat-label>Action</mat-label>
                  <mat-select formControlName="action">
                    @for (action of availableActions; track action) {
                      <mat-option [value]="action">{{ action }}</mat-option>
                    }
                  </mat-select>
                  @if (form.get('action')?.hasError('required') &&
                    form.get('action')?.touched) {
                    <mat-error>Action is required</mat-error>
                  }
                </mat-form-field>

                <!-- Scope Selection -->
                <mat-form-field appearance="outline">
                  <mat-label>Scope</mat-label>
                  <mat-select formControlName="scope">
                    <mat-option value="all">All</mat-option>
                    <mat-option value="own">Own</mat-option>
                    <mat-option value="dept">Department</mat-option>
                    <mat-option value="tenant">Tenant</mat-option>
                  </mat-select>
                  @if (form.get('scope')?.hasError('required') &&
                    form.get('scope')?.touched) {
                    <mat-error>Scope is required</mat-error>
                  }
                </mat-form-field>
              } 
            } 
          </mat-dialog-content>

          <mat-dialog-actions align="end">
            <button mat-button type="button" [mat-dialog-close]="false">
              Cancel
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="form.invalid || state.status === 'loading'"
            >
              {{ data.mode === 'create' ? 'Create' : 'Update' }}>
            </button>
          </mat-dialog-actions>
        }
      </form>
    </div>
  `,
})
export class PermissionDialogComponent implements OnInit {
  form: FormGroup;
  availableActions = ['create', 'read', 'update', 'delete', 'manage'];

  private initialState: DialogState = {
    status: 'idle',
    data: undefined,
    error: null,
  };

  state$ = new BehaviorSubject<DialogState>(this.initialState);

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      resourceId: ['', Validators.required],
      action: ['', Validators.required],
      scope: ['all', Validators.required],
    });
  }

  ngOnInit() {
    this.loadResources();
    if (this.data.mode === 'edit' && this.data.permission) {
      this.form.patchValue({
        resourceId: this.data.permission.resourceDetails.id,
        action: this.data.permission.action,
        scope: this.data.permission.scope || 'all',
      });
    }
  }

  private loadResources() {
    this.updateState({ status: 'loading' });

    this.resourceService.getResources().subscribe({
      next: (resources) => {
        this.updateState({
          status: 'success',
          data: resources,
        });
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to load resources',
        });
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.dialogRef.close(formValue);
    }
  }

  private updateState(partialState: Partial<DialogState>) {
    this.state$.next({
      ...this.state$.value,
      ...partialState,
    });
  }
}

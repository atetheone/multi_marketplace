import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { BehaviorSubject } from 'rxjs';
import { DataState } from '#types/data_state';
import { PermissionService } from '#services/permission.service';
import { PermissionResponse, PermissionGroup } from '#types/permission';
import { RoleResponse } from '#types/role';

interface DialogData {
  role?: RoleResponse;
  mode: 'create' | 'edit';
}

interface DialogState extends DataState<PermissionGroup[]> {
  data?: PermissionGroup[];
}

@Component({
  selector: 'app-role-dialog',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './role-dialog.component.html',
  styles: [`
    .permissions-section
      max-height: 400px
      overflow-y: auto
  `]
})
export class RoleDialogComponent implements OnInit {
  form: FormGroup;
  selectedPermissions = new Set<number>();

  private initialState: DialogState = {
    status: 'idle',
    data: undefined,
    error: null
  };

  state = new BehaviorSubject<DialogState>(this.initialState);

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });

    if (data.role) {
      this.form.patchValue({
        name: data.role.name
      });
      data.role.permissions.forEach(p => this.selectedPermissions.add(p.id));
    }
  }

  ngOnInit() {
    this.loadPermissions();
  }

  private loadPermissions() {
    this.updateState({ status: 'loading' });

    this.permissionService.getPermissions().subscribe({
      next: (response) => {
        this.updateState({
          status: 'success',
          data: response.data
        });
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to load permissions'
        });
      }
    });
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissions.has(permissionId);
  }

  togglePermission(permissionId: number) {
    if (this.selectedPermissions.has(permissionId)) {
      this.selectedPermissions.delete(permissionId);
    } else {
      this.selectedPermissions.add(permissionId);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.dialogRef.close({
        ...formValue,
        permissionIds: Array.from(this.selectedPermissions)
      });
    }
  }

  private updateState(partialState: Partial<DialogState>) {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }
}
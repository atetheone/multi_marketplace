import { ResourceResponse } from "./resource"

export interface PermissionResponse {
  scope?: string
  id: number
  resourceDetails: ResourceResponse
  resource?: string
  action: string
  tenantId?: number
  createdAt?: string
  updatedAt?: string
}


// Basic permission interface
export interface Permission {
  id: number;
  resource?: string;
  action: string;
  resourceId?: number;
  scope: PermissionScope;
  tenantId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Permission Scope enum
export enum PermissionScope {
  ALL = 'all',      // Full access
  OWN = 'own',      // Only own resources
  DEPT = 'dept',    // Department level access
  TENANT = 'tenant' // Tenant level access
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'  // Full control
}


export interface CreatePermissionDto {
  resource?: string;
  action: string;
  resourceId: number;
  scope?: PermissionScope;
}

// DTO for updating an existing permission
export interface UpdatePermissionDto extends Partial<CreatePermissionDto> {
  id: number;
}

export interface PermissionGroup {
  id: number;
  permissions: PermissionResponse[];
}


import { ApiResponse } from './api_response';

export interface MenuItem {
  id: number;
  label: string;
  icon: string;
  route: string;
  order?: number;
  requiredPermissions?: number[];
  children?: MenuItem[];
  parentId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export type MenuResponse = ApiResponse<MenuItem[]>;

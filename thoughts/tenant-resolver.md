# Multi-Tenant resolver for Angular applications

```typescript
// tenant-domain-resolver.ts for handling tenant-specific domain resolution

import { environment } from '../environments/environment';

export class TenantDomainResolver {
  static getTenantFromHostname(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0]; // Assuming the subdomain represents the tenant
    }
    return null;
  }

  static getApiBaseUrl(): string {
    const tenant = this.getTenantFromHostname();
    if (tenant) {
      return `${environment.apiUrl}/api/${tenant}`; // Tenant-specific API base URL using environment variable
    }
    return `${environment.apiUrl}/api`; // Default API base URL using environment variable
  }
}

// Example usage within any service or component
// import { TenantDomainResolver } from './tenant-domain-resolver';
// const apiUrl = TenantDomainResolver.getApiBaseUrl();

```
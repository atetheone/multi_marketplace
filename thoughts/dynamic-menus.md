# Create a menuItem model

## Create a model for the menu item

Table MenuItem(id, title, url?, parent_id, order, created_at, updated_at, is_active, is_internal, tenant_id)

- Each menu item should have a list of authorized roles/permissions
- Each menu navigation of a tenant should be created through the admin panel or with a seeder
- Each menu item should have a parent_id to create a nested menu


### Database Schema with Relationships

```sql
-- Tenants Table
CREATE TABLE tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table (Supporting Multi-Tenant Users)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User profile
CREATE TABLE user_profile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE,
    avatar_url VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- Tenant_Users (Junction Table for Many-to-Many Relationship)
CREATE TABLE tenant_users (
    tenant_id BIGINT,
    user_id BIGINT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, user_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Roles Table (Tenant-Specific Roles)
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Permissions Table (Global Permissions)
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) UNIQUE NOT NULL, -- action:resource, e.g. view:dashboard
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role_Permissions (Junction Table)
CREATE TABLE role_permissions (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- User_Roles (Junction Table for Multi-Tenant Role Assignment)
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    tenant_id BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id, tenant_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Menu Items Table (Tenant-Specific Menus)
CREATE TABLE menu_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT,
    parent_id BIGINT,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(255),
    icon VARCHAR(50),
    order_index INT DEFAULT 0,
    isExternal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE SET NULL
);

-- Menu Item Permissions (For Granular Access Control)
CREATE TABLE menu_item_permissions (
    menu_item_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (menu_item_id, permission_id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

### Relationship Explanations

1. **Users and Tenants**
   - `tenant_users` junction table allows users to be part of multiple tenants
   - `is_owner` flag indicates tenant ownership
   - A user can have different roles in different tenants

2. **Roles and Permissions**
   - Roles are tenant-specific (can have different roles in different tenants)
   - `role_permissions` defines which permissions a role has
   - Permissions are global but can be assigned to roles

3. **User Roles**
   - `user_roles` tracks role assignments per user per tenant
   - Enables complex role-based access control

4. **Menu Items**
   - Tenant-specific menu configuration
   - Supports hierarchical menus via `parent_id`
   - `menu_item_permissions` allows fine-grained access control

### Sample Data Flow

```sql
-- Create a tenant
INSERT INTO tenants (name) VALUES ('Acme Corporation');

-- Create a user
INSERT INTO users (email, password, first_name, last_name) 
VALUES ('john.doe@example.com', 'hashed_password', 'John', 'Doe');

-- Associate user with tenant
INSERT INTO tenant_users (tenant_id, user_id, is_owner) 
VALUES (1, 1, TRUE);

-- Create a role for the tenant
INSERT INTO roles (tenant_id, name, code) 
VALUES (1, 'Admin', 'TENANT_ADMIN');

-- Assign permissions to the role
INSERT INTO permissions (code, description) 
VALUES ('dashboard.view', 'View Dashboard');

INSERT INTO role_permissions (role_id, permission_id)
VALUES (1, 1);

-- Assign role to user in specific tenant
INSERT INTO user_roles (user_id, role_id, tenant_id)
VALUES (1, 1, 1);

-- Create menu items
INSERT INTO menu_items (tenant_id, label, route, type)
VALUES 
(1, 'Dashboard', '/dashboard', 'internal'),
(1, 'External Link', 'https://example.com', 'external');

-- Link menu items to permissions
INSERT INTO menu_item_permissions (menu_item_id, permission_id)
VALUES (1, 1);
```

### TypeORM/Sequelize Equivalent (TypeScript)

```typescript
@Entity()
class User {
  @ManyToMany(() => Tenant, { through: 'tenant_users' })
  tenants: Tenant[];

  @ManyToMany(() => Role, { through: 'user_roles' })
  roles: Role[];
}

@Entity()
class Tenant {
  @OneToMany(() => Role)
  roles: Role[];

  @ManyToMany(() => User, { through: 'tenant_users' })
  users: User[];

  @OneToMany(() => MenuItem)
  menuItems: MenuItem[];
}

@Entity()
class Role {
  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @ManyToMany(() => Permission)
  permissions: Permission[];
}
```

### Benefits of this Design

1. Flexible multi-tenant architecture
2. Users can have different roles in different tenants
3. Fine-grained permission control
4. Tenant-specific menu configurations
5. Supports complex organizational structures

Would you like me to elaborate on any specific aspect of this database design?
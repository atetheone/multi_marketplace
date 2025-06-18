# Database design of the system

```sql
-- Tenant Management
CREATE TABLE Tenants (
    tenant_id SERIAL PRIMARY KEY,
    tenant_name VARCHAR(200) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    domain_name VARCHAR(100),
    logo_url VARCHAR(255),
    brand_color VARCHAR(7),
    business_type VARCHAR(100),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_status VARCHAR(20) CHECK (
        account_status IN ('ACTIVE', 'SUSPENDED', 'PENDING_APPROVAL')
    ) DEFAULT 'PENDING_APPROVAL',
    contact_email VARCHAR(100) UNIQUE NOT NULL,
    contact_phone VARCHAR(20),
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    custom_theme_json JSONB, -- Flexible UI customization
    marketplace_visibility BOOLEAN DEFAULT TRUE
);

-- Tenant User Authentication
CREATE TABLE Tenant_Users (
    tenant_user_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (
        role IN ('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
    ),
    last_login TIMESTAMP,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    permissions JSONB -- Flexible permission management
);

-- Stores/Outlets within Tenants
CREATE TABLE Stores (
    store_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    store_name VARCHAR(200) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    physical_address TEXT,
    store_type VARCHAR(50) CHECK (
        store_type IN ('PHYSICAL', 'ONLINE', 'HYBRID')
    ),
    store_status VARCHAR(20) CHECK (
        store_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')
    ) DEFAULT 'ACTIVE',
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_sales DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Updated Products Table (Now linked to Stores and Tenants)
CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    store_id INTEGER REFERENCES Stores(store_id),
    category_id INTEGER REFERENCES Categories(category_id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    condition VARCHAR(20) CHECK (
        condition IN ('NEW', 'USED', 'REFURBISHED')
    ),
    is_marketplace_visible BOOLEAN DEFAULT TRUE,
    marketplace_priority INTEGER DEFAULT 0,
    tags VARCHAR(100)[], -- For advanced searching and filtering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace-wide Product Indexing
CREATE TABLE Marketplace_Product_Index (
    index_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(product_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    global_ranking DECIMAL(10,2),
    total_sales INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),
    last_indexed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenant Payout and Financial Tracking
CREATE TABLE Tenant_Payouts (
    payout_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    total_sales DECIMAL(10,2),
    marketplace_commission DECIMAL(10,2),
    net_payout DECIMAL(10,2),
    payout_period_start TIMESTAMP,
    payout_period_end TIMESTAMP,
    payout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payout_status VARCHAR(20) CHECK (
        payout_status IN ('PENDING', 'PROCESSED', 'FAILED')
    ) DEFAULT 'PENDING'
);

-- Modifications to Orders to support multi-tenant scenarios
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id), -- Primary tenant for the order
    shipping_address_id INTEGER REFERENCES Addresses(address_id),
    billing_address_id INTEGER REFERENCES Addresses(address_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    order_source VARCHAR(20) CHECK (
        order_source IN ('MARKETPLACE', 'TENANT_DIRECT', 'STORE_DIRECT')
    ),
    payment_method VARCHAR(50),
    is_cross_tenant BOOLEAN DEFAULT FALSE
);

-- Order Items with Tenant and Store Context
CREATE TABLE Order_Items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(order_id),
    product_id INTEGER REFERENCES Products(product_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    store_id INTEGER REFERENCES Stores(store_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tenant_commission DECIMAL(10, 2),
    shipping_status VARCHAR(20) CHECK (
        shipping_status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED')
    ) DEFAULT 'PENDING'
);

-- Tenant-specific Configuration and Customization
CREATE TABLE Tenant_Configurations (
    config_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    config_key VARCHAR(100),
    config_value JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

Key Features of the Multi-Tenant Marketplace Design:

1. **Tenant Management**
   - Comprehensive `Tenants` table with subdomain and domain support
   - Flexible UI customization via `custom_theme_json`
   - Marketplace visibility control
   - Detailed tenant account management

2. **Flexible User Authentication**
   - `Tenant_Users` with granular role and permission management
   - JSON-based permissions for maximum flexibility

3. **Product and Marketplace Integration**
   - `Marketplace_Product_Index` for global product ranking
   - Products can be selectively visible in the marketplace
   - Advanced tagging and search capabilities

4. **Order and Financial Tracking**
   - Order source tracking (marketplace, tenant-direct, store-direct)
   - Support for cross-tenant orders
   - Detailed commission and payout mechanisms

5. **Customization and Configuration**
   - `Tenant_Configurations` for tenant-specific settings
   - Supports JSON-based configuration for maximum flexibility

Architecture Highlights:
- Supports multiple tenants within a single platform
- Flexible subdomain and branding options
- Unified marketplace with tenant-specific experiences
- Granular control over product visibility and ranking

Potential Use Cases:
  - Multi-brand e-commerce platforms
  - Franchise-based marketplaces
  - White-label e-commerce solutions

Implementation Considerations:

  - Use of JSONB for flexible configurations
  - Comprehensive indexing for marketplace search
  - Support for tenant-specific and marketplace-wide product discovery

Additional Recommendations:

  - Implement caching strategies for tenant and product information
  - Create comprehensive indexing and search functionality
  - Develop robust API layer for tenant and marketplace interactions



## V2 improvement

I'll decouple the tenant and user tables, and then walk through a comprehensive user flow for product ordering, highlighting the database interactions at each stage.


```sql
-- User Authentication and Core Information
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) CHECK (
        account_status IN ('ACTIVE', 'SUSPENDED', 'INACTIVE')
    ) DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profile (Separate from Authentication)
CREATE TABLE User_Profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES Users(user_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    profile_picture_url VARCHAR(255),
    preferred_language VARCHAR(10),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenant-User Relationship (Many-to-Many)
CREATE TABLE Tenant_User_Roles (
    tenant_user_role_id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    user_id INTEGER REFERENCES Users(user_id),
    role VARCHAR(50) CHECK (
        role IN ('CUSTOMER', 'SELLER', 'ADMIN', 'SUPPORT')
    ),
    additional_permissions JSONB,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_primary_account BOOLEAN DEFAULT FALSE
);

-- Product Selection and Cart Flow
CREATE TABLE Cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cart_status VARCHAR(20) CHECK (
        cart_status IN ('ACTIVE', 'CONVERTED', 'ABANDONED')
    ) DEFAULT 'ACTIVE'
);

CREATE TABLE Cart_Items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES Cart(cart_id),
    product_id INTEGER REFERENCES Products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price_at_addition DECIMAL(10,2) NOT NULL,
    variant_id INTEGER REFERENCES Product_Variants(variant_id)
);

-- Wishlist Feature
CREATE TABLE Wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    name VARCHAR(100) DEFAULT 'My Wishlist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Wishlist_Items (
    wishlist_item_id SERIAL PRIMARY KEY,
    wishlist_id INTEGER REFERENCES Wishlist(wishlist_id),
    product_id INTEGER REFERENCES Products(product_id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Extended Order Process
CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'AUTHORIZED',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);

CREATE TABLE Payment_Methods (
    payment_method_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    method_type VARCHAR(50) CHECK (
        method_type IN ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER')
    ),
    provider VARCHAR(50),
    masked_identifier VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    tenant_id INTEGER REFERENCES Tenants(tenant_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Shipping Details
    shipping_address_id INTEGER REFERENCES Addresses(address_id),
    shipping_method VARCHAR(50),
    shipping_cost DECIMAL(10,2),
    
    -- Billing Details
    billing_address_id INTEGER REFERENCES Addresses(address_id),
    payment_method_id INTEGER REFERENCES Payment_Methods(payment_method_id),
    
    -- Order Metrics
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status Tracking
    order_status VARCHAR(20) CHECK (
        order_status IN ('CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')
    ) DEFAULT 'CREATED',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional Metadata
    customer_notes TEXT,
    internal_notes TEXT
);

CREATE TABLE Order_Items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(order_id),
    product_id INTEGER REFERENCES Products(product_id),
    variant_id INTEGER REFERENCES Product_Variants(variant_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Tax and Discount Tracking
    tax_rate DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    
    -- Fulfillment Details
    fulfillment_status VARCHAR(20) CHECK (
        fulfillment_status IN ('PENDING', 'PROCESSED', 'SHIPPED', 'DELIVERED')
    ) DEFAULT 'PENDING'
);

CREATE TABLE Payment_Transactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(order_id),
    payment_method_id INTEGER REFERENCES Payment_Methods(payment_method_id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3),
    status payment_status DEFAULT 'PENDING',
    
    -- Payment Gateway Details
    gateway_transaction_id VARCHAR(100),
    gateway_response JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

Typical E-Commerce User Flow with Database Interactions:

1. **User Registration and Authentication**
   - User creates account in `Users` table
   - Detailed profile stored in `User_Profiles`
   - Optional association with tenants via `Tenant_User_Roles`

2. **Product Discovery**
   - User browses products across tenants
   - Products can be added to cart or wishlist
   - `Cart` and `Wishlist` tables track user's interactions

3. **Cart Management**
   - `Cart` and `Cart_Items` track selected products
   - Supports multiple items, quantities, and variants
   - Can span across different tenants

4. **Checkout Process**
   - Select or add shipping/billing addresses
   - Choose payment method from `Payment_Methods`
   - Create `Orders` and `Order_Items`
   - Generate unique order number
   - Record payment transaction in `Payment_Transactions`

5. **Order Fulfillment**
   - Update order status
   - Track shipping and delivery
   - Handle potential returns or cancellations

Key Design Improvements:
- Completely decoupled user management
- Flexible tenant-user relationships
- Comprehensive order and payment tracking
- Support for multiple payment methods
- Detailed status tracking at order and item levels

Additional Features:
- Wishlist functionality
- Variant support
- Flexible payment and shipping options
- Comprehensive metadata storage

Potential Enhancements:
- Implement caching for frequently accessed data
- Create indexes on frequently queried columns
- Add additional security layers for payment processing

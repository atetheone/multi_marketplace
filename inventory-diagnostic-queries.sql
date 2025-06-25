-- ====================================
-- DIAGNOSTIC QUERIES FOR INVENTORY ISSUE
-- ====================================

-- 1. CHECK CART AND PRODUCTS FROM YOUR LOG
-- Cart ID: 20, Products: 228 (tenant 5), 55 (tenant 3)

-- Verify cart exists
SELECT * FROM carts WHERE id = 20;

-- Check cart items and their tenant associations
SELECT 
    ci.id as cart_item_id,
    ci.cart_id,
    ci.product_id,
    ci.quantity,
    ci.tenant_id as cart_item_tenant_id,
    p.name as product_name,
    p.tenant_id as product_tenant_id,
    p.price
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.cart_id = 20;

-- ====================================
-- 2. CHECK INVENTORY RECORDS
-- ====================================

-- Check if inventory records exist for the specific products and tenants
SELECT 
    i.id,
    i.product_id,
    i.tenant_id,
    i.quantity,
    i."reservedQuantity",  -- Note: check column name (might be reserved_quantity)
    i.reorder_point,
    p.name as product_name,
    p.tenant_id as product_tenant_id
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id IN (228, 55);

-- Check specifically for the problematic products with their tenant IDs
SELECT 
    'Product 228 (tenant 5)' as description,
    i.*
FROM inventory i
WHERE i.product_id = 228 AND i.tenant_id = 5
UNION ALL
SELECT 
    'Product 55 (tenant 3)' as description,
    i.*
FROM inventory i
WHERE i.product_id = 55 AND i.tenant_id = 3;

-- ====================================
-- 3. FIND MISSING INVENTORY RECORDS
-- ====================================

-- Products that exist but don't have inventory records
SELECT 
    p.id as product_id,
    p.name,
    p.tenant_id,
    CASE 
        WHEN i.id IS NULL THEN 'MISSING INVENTORY'
        ELSE 'HAS INVENTORY'
    END as inventory_status
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id AND p.tenant_id = i.tenant_id
WHERE p.id IN (228, 55)
ORDER BY p.id;

-- ====================================
-- 4. CHECK COLUMN NAMES IN INVENTORY TABLE
-- ====================================

-- Check actual column names (PostgreSQL specific)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventory' 
ORDER BY ordinal_position;

-- ====================================
-- 5. DIAGNOSTIC: ALL INVENTORY VS PRODUCTS
-- ====================================

-- Show all products and their inventory status
SELECT 
    p.id as product_id,
    p.name,
    p.tenant_id as product_tenant,
    i.tenant_id as inventory_tenant,
    i.quantity,
    COALESCE(i."reservedQuantity", i.reserved_quantity, 0) as reserved_qty,
    CASE 
        WHEN i.id IS NULL THEN 'NO INVENTORY RECORD'
        WHEN p.tenant_id != i.tenant_id THEN 'TENANT MISMATCH'
        ELSE 'OK'
    END as status
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.id IN (228, 55)
ORDER BY p.id;

-- ====================================
-- 6. FIX: CREATE MISSING INVENTORY RECORDS
-- ====================================

-- Insert missing inventory records for products that don't have them
-- (Only run this if the diagnostic queries show missing records)

/*
INSERT INTO inventory (product_id, tenant_id, quantity, "reservedQuantity", reorder_point, reorder_quantity, low_stock_threshold, created_at, updated_at)
SELECT 
    p.id,
    p.tenant_id,
    10 as default_quantity,  -- Set appropriate default quantity
    0 as reserved_quantity,
    5 as reorder_point,
    20 as reorder_quantity,
    3 as low_stock_threshold,
    NOW(),
    NOW()
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id AND p.tenant_id = i.tenant_id
WHERE p.id IN (228, 55) 
  AND i.id IS NULL;  -- Only insert where inventory doesn't exist
*/

-- ====================================
-- 7. VERIFY THE FIX
-- ====================================

-- After running the insert, verify all products have inventory
SELECT 
    p.id,
    p.name,
    p.tenant_id,
    i.quantity,
    i."reservedQuantity",
    'INVENTORY EXISTS' as status
FROM products p
JOIN inventory i ON p.id = i.product_id AND p.tenant_id = i.tenant_id
WHERE p.id IN (228, 55);

-- ====================================
-- EXECUTION ORDER:
-- 1. Run diagnostic queries (1-5) first
-- 2. If missing inventory records found, uncomment and run query 6
-- 3. Run verification query 7
-- ====================================
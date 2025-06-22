-- Cleanup script for fixing invalid JSON data in resources table
-- Run this if you have existing data with invalid JSON in available_actions

-- Step 1: Backup existing data
CREATE TABLE IF NOT EXISTS resources_backup AS SELECT * FROM resources;

-- Step 2: Fix any non-JSON string values to be proper JSON arrays
UPDATE resources 
SET available_actions = CASE 
    WHEN available_actions = 'create' THEN '["create"]'
    WHEN available_actions = 'read' THEN '["read"]'
    WHEN available_actions = 'update' THEN '["update"]'
    WHEN available_actions = 'delete' THEN '["delete"]'
    WHEN available_actions IS NULL THEN '[]'
    WHEN available_actions = '' THEN '[]'
    -- Add more specific cases as needed
    ELSE 
        CASE 
            WHEN available_actions::text ~ '^\[.*\]$' THEN available_actions -- Already valid JSON array
            ELSE '["' || available_actions || '"]' -- Wrap single value in array
        END
END
WHERE available_actions IS NOT NULL;

-- Step 3: Verify the cleanup worked
SELECT id, name, available_actions FROM resources LIMIT 10;
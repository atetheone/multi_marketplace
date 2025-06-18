# Theming design


```sql
-- Example of inserting a comprehensive tenant theme configuration
INSERT INTO Tenants (
    tenant_name, 
    subdomain, 
    contact_email, 
    custom_theme_json
) VALUES (
    'Fashion World', 
    'fashion-world', 
    'contact@fashionworld.com',
    '{
        "branding": {
            "primary_color": "#3498db",
            "secondary_color": "#2ecc71",
            "accent_color": "#e74c3c",
            "logo_url": "/uploads/fashion-world-logo.png"
        },
        "typography": {
            "font_family": {
                "headings": "\'Montserrat\', sans-serif",
                "body": "\'Open Sans\', sans-serif"
            },
            "font_sizes": {
                "h1": "2.5rem",
                "h2": "2rem",
                "h3": "1.75rem",
                "body": "1rem",
                "small": "0.875rem"
            }
        },
        "layout": {
            "header": {
                "style": "sticky",
                "height": "80px",
                "background_type": "solid"
            },
            "sidebar": {
                "position": "left",
                "width": "300px",
                "collapsed_width": "80px"
            },
            "product_grid": {
                "columns": 4,
                "items_per_page": 12,
                "hover_effect": "shadow"
            }
        },
        "components": {
            "buttons": {
                "primary": {
                    "background_color": "#3498db",
                    "text_color": "#ffffff",
                    "border_radius": "5px",
                    "hover_effect": "darken"
                },
                "secondary": {
                    "background_color": "#2ecc71",
                    "text_color": "#ffffff",
                    "border_radius": "3px",
                    "hover_effect": "outline"
                }
            },
            "forms": {
                "input_style": {
                    "border_color": "#bdc3c7",
                    "focus_border_color": "#3498db",
                    "padding": "10px",
                    "border_radius": "4px"
                }
            }
        },
        "responsive_breakpoints": {
            "mobile": {
                "max_width": 576,
                "adjustments": {
                    "font_size_reduction": "20%",
                    "grid_columns": 2
                }
            },
            "tablet": {
                "min_width": 577,
                "max_width": 992,
                "adjustments": {
                    "grid_columns": 3
                }
            },
            "desktop": {
                "min_width": 993
            }
        }
    }'::JSONB
);

-- Utility functions for working with JSONB configurations

-- Function to update a specific theme configuration
CREATE OR REPLACE FUNCTION update_tenant_theme_config(
    p_tenant_id INTEGER, 
    p_key TEXT, 
    p_value JSONB
) RETURNS VOID AS $$
BEGIN
    UPDATE Tenants
    SET custom_theme_json = 
        jsonb_set(
            custom_theme_json, 
            ARRAY[p_key], 
            p_value, 
            true
        )
    WHERE tenant_id = p_tenant_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a specific theme configuration value
CREATE OR REPLACE FUNCTION get_tenant_theme_config(
    p_tenant_id INTEGER, 
    p_key TEXT
) RETURNS JSONB AS $$
DECLARE
    v_config JSONB;
BEGIN
    SELECT custom_theme_json->p_key INTO v_config
    FROM Tenants
    WHERE tenant_id = p_tenant_id;
    
    RETURN v_config;
END;
$$ LANGUAGE plpgsql;

-- Example of using the update function
-- Update primary color for a tenant
SELECT update_tenant_theme_config(
    1, 
    'branding', 
    '{"primary_color": "#ff6b6b", "secondary_color": "#4ecdc4"}'::JSONB
);

-- Example queries to retrieve specific configuration values
-- Get the primary color
SELECT 
    tenant_name, 
    custom_theme_json->'branding'->>'primary_color' AS primary_color
FROM Tenants
WHERE tenant_id = 1;

-- Get all font sizes
SELECT 
    tenant_name, 
    custom_theme_json->'typography'->'font_sizes' AS font_sizes
FROM Tenants
WHERE tenant_id = 1;

-- Complex query to check responsive breakpoints
SELECT 
    tenant_name, 
    (custom_theme_json->'responsive_breakpoints'->>'mobile')::JSONB AS mobile_config
FROM Tenants
WHERE tenant_id = 1;

```

Key Aspects of Tenant Theme Configuration:

1. **Comprehensive Theme Structure**
   - Branding (colors, logo)
   - Typography (fonts, sizes)
   - Layout configurations
   - Component-specific styling
   - Responsive breakpoint settings

2. **Flexible JSONB Manipulation**
   - `jsonb_set()` for updating specific nested paths
   - Custom functions for easy configuration management
   - Ability to deeply nest and modify configurations

3. **Utility Functions**
   - `update_tenant_theme_config()`: Update specific theme settings
   - `get_tenant_theme_config()`: Retrieve specific configuration values

4. **Querying JSONB Configurations**
   - Direct path traversal
   - Nested object and array access
   - Type casting for specific value retrieval

Practical Use Cases:
- Dynamic theming across different tenants
- A/B testing of UI configurations
- Granular control over application appearance
- Easy extension of theme properties

Recommended Frontend Integration:
- Parse the JSONB configuration in your frontend application
- Use the configuration to dynamically generate CSS variables
- Create a theme provider that applies these settings

Example Frontend Processing (Pseudo-code):
```javascript
function applyTenantTheme(tenantConfig) {
  // Generate CSS variables
  const root = document.documentElement;
  root.style.setProperty('--primary-color', tenantConfig.branding.primary_color);
  root.style.setProperty('--font-family-body', tenantConfig.typography.font_family.body);
  
  // Apply responsive adjustments
  if (window.innerWidth < tenantConfig.responsive_breakpoints.mobile.max_width) {
    // Mobile-specific adjustments
  }
}
```

Considerations:
- Validate JSON structure before insertion
- Implement caching mechanisms
- Consider performance for deeply nested configurations

Would you like me to elaborate on any specific aspect of tenant theme configuration?
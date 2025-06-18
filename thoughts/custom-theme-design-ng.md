# Theming design considering angular


```typescript
// tenant-theme.interface.ts
export interface TenantThemeConfig {
  branding: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string;
  };
  typography: {
    font_family: {
      headings: string;
      body: string;
    };
    font_sizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
  layout: {
    header: {
      style: 'sticky' | 'fixed' | 'static';
      height: string;
      background_type: 'solid' | 'gradient';
    };
    sidebar: {
      position: 'left' | 'right';
      width: string;
      collapsed_width: string;
    };
  };
  components: {
    buttons: {
      primary: ButtonStyle;
      secondary: ButtonStyle;
    };
    forms: {
      input_style: {
        border_color: string;
        focus_border_color: string;
        padding: string;
        border_radius: string;
      };
    };
  };
  responsive_breakpoints: {
    mobile: ResponsiveBreakpoint;
    tablet: ResponsiveBreakpoint;
    desktop: ResponsiveBreakpoint;
  };
}

interface ButtonStyle {
  background_color: string;
  text_color: string;
  border_radius: string;
  hover_effect: 'darken' | 'outline' | 'shadow';
}

interface ResponsiveBreakpoint {
  min_width?: number;
  max_width?: number;
  adjustments?: {
    font_size_reduction?: string;
    grid_columns?: number;
  };
}

// tenant-theme.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TenantThemeConfig } from './tenant-theme.interface';
import { ThemeService } from './theme.service'; // Hypothetical theme service

@Injectable({
  providedIn: 'root'
})
export class TenantThemeService {
  private themeConfigSubject = new BehaviorSubject<TenantThemeConfig | null>(null);
  public themeConfig$ = this.themeConfigSubject.asObservable();

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Fetch tenant theme configuration from API
  fetchTenantThemeConfig(tenantId: number): Observable<TenantThemeConfig> {
    return this.http.get<{custom_theme_json: TenantThemeConfig}>(`/api/tenants/${tenantId}`)
      .pipe(
        map(response => {
          this.applyTenantTheme(response.custom_theme_json);
          return response.custom_theme_json;
        })
      );
  }

  // Apply tenant theme to the application
  applyTenantTheme(config: TenantThemeConfig): void {
    // Update Angular Material theme
    this.updateMaterialTheme(config);

    // Apply custom CSS variables
    this.applyCustomCssVariables(config);

    // Update logo
    this.updateLogo(config.branding.logo_url);

    // Apply font styles
    this.applyFontStyles(config.typography);

    // Save current theme configuration
    this.themeConfigSubject.next(config);
  }

  // Create Angular Material theme
  private updateMaterialTheme(config: TenantThemeConfig): void {
    const primaryPalette = this.createPaletteFromColor(config.branding.primary_color);
    const accentPalette = this.createPaletteFromColor(config.branding.accent_color);
    const warnPalette = this.createPaletteFromColor(config.branding.secondary_color);

    const theme = this.themeService.createTheme({
      primary: primaryPalette,
      accent: accentPalette,
      warn: warnPalette
    });

    this.themeService.applyTheme(theme);
  }

  // Generate Material color palette from a base color
  private createPaletteFromColor(baseColor: string): any {
    // Implement color palette generation logic
    // This could use a library like color.js or a custom implementation
    return {
      50: this.lightenColor(baseColor, 0.52),
      100: this.lightenColor(baseColor, 0.37),
      200: this.lightenColor(baseColor, 0.26),
      300: this.lightenColor(baseColor, 0.12),
      400: this.lightenColor(baseColor, 0.06),
      500: baseColor,
      600: this.darkenColor(baseColor, 0.06),
      700: this.darkenColor(baseColor, 0.12),
      800: this.darkenColor(baseColor, 0.18),
      900: this.darkenColor(baseColor, 0.24),
      contrast: {
        50: 'rgba(0,0,0,0.87)',
        100: 'rgba(0,0,0,0.87)',
        200: 'rgba(0,0,0,0.87)',
        300: 'rgba(0,0,0,0.87)',
        400: 'rgba(0,0,0,0.87)',
        500: 'white',
        600: 'white',
        700: 'white',
        800: 'white',
        900: 'white'
      }
    };
  }

  // Utility methods for color manipulation
  private lightenColor(color: string, percent: number): string {
    // Implement color lightening logic
    return color; // Placeholder
  }

  private darkenColor(color: string, percent: number): string {
    // Implement color darkening logic
    return color; // Placeholder
  }

  // Apply custom CSS variables
  private applyCustomCssVariables(config: TenantThemeConfig): void {
    const root = this.document.documentElement;

    // Branding variables
    root.style.setProperty('--tenant-primary-color', config.branding.primary_color);
    root.style.setProperty('--tenant-secondary-color', config.branding.secondary_color);
    root.style.setProperty('--tenant-accent-color', config.branding.accent_color);

    // Typography variables
    root.style.setProperty('--tenant-font-family-headings', config.typography.font_family.headings);
    root.style.setProperty('--tenant-font-family-body', config.typography.font_family.body);

    // Font size variables
    Object.entries(config.typography.font_sizes).forEach(([key, value]) => {
      root.style.setProperty(`--tenant-font-size-${key}`, value);
    });

    // Component-specific variables
    root.style.setProperty('--tenant-button-primary-bg', config.components.buttons.primary.background_color);
    root.style.setProperty('--tenant-button-primary-text', config.components.buttons.primary.text_color);
  }

  // Update application logo
  private updateLogo(logoUrl: string): void {
    const logoElement = this.document.getElementById('tenant-logo');
    if (logoElement) {
      logoElement.setAttribute('src', logoUrl);
    }
  }

  // Apply font styles
  private applyFontStyles(typography: TenantThemeConfig['typography']): void {
    // Load custom fonts if needed
    this.loadCustomFonts([
      typography.font_family.headings,
      typography.font_family.body
    ]);
  }

  // Load custom fonts
  private loadCustomFonts(fontFamilies: string[]): void {
    fontFamilies.forEach(fontFamily => {
      const fontLink = this.document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
      this.document.head.appendChild(fontLink);
    });
  }
}

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container>
      <!-- Application layout with dynamic tenant theming -->
      <mat-toolbar [style.height]="(tenantThemeService.themeConfig$ | async)?.layout.header.height">
        <img id="tenant-logo" alt="Tenant Logo" />
      </mat-toolbar>

      <!-- Rest of the application layout -->
    </mat-sidenav-container>
  `
})
export class AppComponent implements OnInit {
  constructor(
    public tenantThemeService: TenantThemeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch tenant theme based on current tenant
    this.route.paramMap.pipe(
      map(params => params.get('tenantId')),
      filter(tenantId => !!tenantId),
      switchMap(tenantId => 
        this.tenantThemeService.fetchTenantThemeConfig(Number(tenantId))
      )
    ).subscribe();
  }
}

// styles.scss (Global Styles)
:root {
  // Fallback variables
  --tenant-primary-color: #3498db;
  --tenant-secondary-color: #2ecc71;
  --tenant-accent-color: #e74c3c;

  // Typography
  --tenant-font-family-headings: 'Montserrat', sans-serif;
  --tenant-font-family-body: 'Open Sans', sans-serif;

  // Custom component styles using CSS variables
  .tenant-primary-button {
    background-color: var(--tenant-primary-color);
    color: var(--tenant-button-primary-text);
  }
}

```

Key Features of the Angular Tenant Theme Integration:

1. **Comprehensive Type Definition**
   - `TenantThemeConfig` interface defines the complete theme structure
   - Provides type safety and intellisense

2. **Theme Service Responsibilities**
   - Fetch tenant theme configuration
   - Apply theme to Angular Material
   - Set CSS variables
   - Update application branding
   - Load custom fonts

3. **Angular Material Theme Customization**
   - Dynamic color palette generation
   - Custom primary, accent, and warn colors
   - Contrast color handling

4. **CSS Variable Management**
   - Global CSS variables for easy theme application
   - Fallback styles for default theming
   - Flexible styling across components

5. **Responsive Considerations**
   - Supports responsive breakpoint configurations
   - Can be extended to handle mobile/tablet specific adjustments

Implementation Highlights:
- Uses RxJS for reactive theme management
- Supports dynamic theme switching
- Integrates with Angular Material
- Provides flexibility for custom branding

Recommended Additional Steps:
- Implement color palette generation library
- Create a more robust theme service
- Add error handling for theme loading
- Implement caching mechanism for theme configurations

Would you like me to elaborate on any specific aspect of the tenant theming approach?
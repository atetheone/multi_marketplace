import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#services/auth.service'
import { CartService } from '#shared/services/cart.service'
@Component({
  selector: 'app-navbar',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass',
})
export class NavbarComponent implements OnInit {
  cartItemCount$!: Observable<number>;
  isUserMenuOpen = false;
  isCategoryMenuOpen = false;
  isAuthenticated = false;
  isMobileMenuOpen = false;

  mainNavItems = [
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/deals', label: 'Deals' },
  ];

  userMenuItems = [
    { icon: 'person', label: 'My Profile', path: '/profile' },
    { icon: 'shopping_bag', label: 'My Orders', path: '/dashboard/orders' },
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'favorite', label: 'Wishlist', path: '/wishlist' },
    { icon: 'settings', label: 'Settings', path: '/settings' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.cartItemCount$ = this.cartService.getCartItemCount();
    // this.cartService.getCartItemCount().subscribe({
    //   next: cnt => this.cartItemCount = cnt
    // })
  }
  

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((state) => {
      this.isAuthenticated = state;
    })
  }

  logout(): void {
    this.authService.logout();
  }


  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

}
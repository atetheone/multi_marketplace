import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CartService } from '#shared/services/cart.service';
import { OrderService } from '#shared/services/order.service';
import { AddressService } from '#shared/services/address.service';
import { ZoneService } from '#shared/services/zone.service';
import { ToastService } from '#shared/services/toast.service';
import { CartResponse, CartItem } from '#types/cart';
import { AddressResponse, AddressRequest } from '#types/address';
import { DeliveryZoneResponse } from '#types/zone';
import { OrderResponse, CreateOrderRequest } from '#types/order';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-checkout',
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.sass'
})
export class CheckoutComponent {
  cart$: Observable<CartResponse | null>;
  checkoutForm!: FormGroup;
  isProcessing = false;
  zones: DeliveryZoneResponse[] = [];
  
  // Address management properties
  savedAddresses: AddressResponse[] = [];
  selectedAddressMode: 'existing' | 'new' = 'new';
  selectedAddressId: number | null = null;
  hasDefaultAddress = false;
  makeDefaultAddress = false;
  filteredZones: DeliveryZoneResponse[] = [];
  selectedZone?: DeliveryZoneResponse;
  zoneSearchCtrl = new FormControl('');
  addresses: AddressResponse[] = []

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private zoneService: ZoneService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
    this.initForm();

    this.zoneSearchCtrl.valueChanges.subscribe(value => {
      this.filterZones(value || '');
    });
  }

  ngOnInit() {
    this.cartService.refreshCart();
    this.loadZones();
    this.loadUserAddresses();
  }

  private initForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: [''],
        country: ['', Validators.required],
        postalCode: [''],
        phone: [''],
        isDefault: [false],
        type: ['shipping'],
        zone: ['', Validators.required]
      }),
      paymentMethod: ['cash', Validators.required]
    });
  }

  placeOrder() {
    this.isProcessing = true;

    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        if (!cart) {
          this.toastService.error('No active cart');
          this.isProcessing = false;
          return;
        }

        // Save new address if in "new" mode and makeDefaultAddress is checked
        if (this.selectedAddressMode === 'new' && this.makeDefaultAddress) {
          const newAddressData: AddressRequest = {
            ...this.checkoutForm.get('shippingAddress')?.value,
            zoneId: this.checkoutForm.get('shippingAddress')?.value.zone.id,
            type: 'shipping' as const,
            isDefault: true
          };

          this.addressService.createAddress(newAddressData).subscribe({
            next: (address) => {
              console.log('Address saved as default:', address);
              this.proceedWithOrder(cart);
            },
            error: (error) => {
              console.error('Error saving address:', error);
              // Proceed with order anyway
              this.proceedWithOrder(cart);
            }
          });
        } else {
          this.proceedWithOrder(cart);
        }
      }
    });
  }

  private proceedWithOrder(cart: CartResponse) {
    const orderData: CreateOrderRequest = {
      cartId: cart.id,
      shippingAddress: {
        ...this.checkoutForm.get('shippingAddress')?.value,
        zoneId: this.checkoutForm.get('shippingAddress')?.value.zone.id,
        type: 'shipping' as const
      },
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response: OrderResponse) => {
        this.toastService.success('Order placed successfully');
        this.router.navigate(['/dashboard/orders', response.id]);
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        this.toastService.error('Failed to place order. Please try again.');
        this.isProcessing = false;
      }
    });
  }

  getSubtotal(cart: CartResponse): number {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    const total = cart.items.reduce((total: number, item: CartItem) => {
      const price = Number(item.product.price);
      const quantity = Number(item.quantity);
      return total + (price * quantity);
    }, 0);

    return Number(total.toFixed(2));
  }

  getTotal(cart: CartResponse): number {
    if (!cart) {
      return 0;
    }
    const subtotal = this.getSubtotal(cart);
    const delivery = Number(this.getDeliveryFee());
    const total = subtotal + delivery;
    return Number(total.toFixed(2));
  }

  onSubmit() {

  }

  private loadZones() {
    this.zoneService.getZones().subscribe({
      next: (zones) => {
        this.zones = zones;
      },
      error: (error) => {
        this.toastService.error('Failed to load delivery zones');
      }
    });
  }

  getDeliveryFee(): number {
    const zone = this.checkoutForm.get('shippingAddress.zone')?.value;
    if (!zone || !zone.id) {
      return 0;
    }
    const selectedZone = this.zones.find(zone_ => zone_.id === zone.id);
    return selectedZone?.fee || zone.fee || 0;
  }

  onZoneSelected(event: MatAutocompleteSelectedEvent) {
    const zone = event.option.value as DeliveryZoneResponse;
    this.selectedZone = zone;
    this.checkoutForm.patchValue({
      shippingAddress: {
        zone: zone
      }
    });
  }

  private filterZones(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredZones = this.zones.filter(zone => 
      zone.name.toLowerCase().includes(filterValue)
    );
  }



  private loadUserAddresses() {
    this.addressService.loadUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.savedAddresses = addresses;
        
        // Check if there are any addresses (we'll show options if there are any addresses)
        const defaultAddress = addresses.find(addr => addr.isDefault);
        this.hasDefaultAddress = addresses.length > 0;
        
        if (defaultAddress) {
          // If there's a default address, preselect it
          this.selectedAddressMode = 'existing';
          this.selectedAddressId = defaultAddress.id;
          this.populateFormWithAddress(defaultAddress);
          // Zone is not required for existing addresses since it comes from the address
          this.checkoutForm.get('shippingAddress.zone')?.clearValidators();
          this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
        } else if (addresses.length > 0) {
          // There are addresses but no default - let user choose from existing or create new
          this.selectedAddressMode = 'existing';
          this.selectedAddressId = addresses[0].id; // Select first address
          this.populateFormWithAddress(addresses[0]);
          this.checkoutForm.get('shippingAddress.zone')?.clearValidators();
          this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
        } else {
          // No addresses at all, force new address mode
          this.selectedAddressMode = 'new';
          this.selectedAddressId = null;
          this.hasDefaultAddress = false;
          // Make zone required for new addresses
          this.checkoutForm.get('shippingAddress.zone')?.setValidators([Validators.required]);
          this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.toastService.error('Failed to load addresses');
        this.selectedAddressMode = 'new';
        this.hasDefaultAddress = false;
        // Make zone required for new addresses when there's an error
        this.checkoutForm.get('shippingAddress.zone')?.setValidators([Validators.required]);
        this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
      }
    });
  }

  onAddressModeChange() {
    if (this.selectedAddressMode === 'new') {
      this.checkoutForm.get('shippingAddress')?.reset();
      this.selectedAddressId = null;
      // Make zone required for new addresses
      this.checkoutForm.get('shippingAddress.zone')?.setValidators([Validators.required]);
      this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
    } else if (this.selectedAddressMode === 'existing' && this.savedAddresses.length > 0) {
      // Try to use default address first, otherwise use first address
      const defaultAddress = this.savedAddresses.find(addr => addr.isDefault);
      const addressToUse = defaultAddress || this.savedAddresses[0];
      
      if (addressToUse) {
        this.selectedAddressId = addressToUse.id;
        this.populateFormWithAddress(addressToUse);
        // Zone is not required for existing addresses since it comes from the address
        this.checkoutForm.get('shippingAddress.zone')?.clearValidators();
        this.checkoutForm.get('shippingAddress.zone')?.updateValueAndValidity();
      }
    }
  }

  onAddressSelect(event: any) {
    const addressId = event.value;
    const selectedAddress = this.savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      this.populateFormWithAddress(selectedAddress);
    }
  }

  private populateFormWithAddress(address: AddressResponse) {
    this.checkoutForm.get('shippingAddress')?.patchValue({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state || '',
      country: address.country,
      postalCode: address.postalCode || '',
      phone: address.phone,
      zone: this.zones.find(zone => zone.id === address.zone.id)
    });
  }

  displayZone = (zone: DeliveryZoneResponse): string => {
    if (!zone) return '';
    return `${zone.name} - ${zone.fee} FCFA`;
  }
}

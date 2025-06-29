import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartOverviewComponent } from './cart-overview.component';

describe('CartOverviewComponent', () => {
  let component: CartOverviewComponent;
  let fixture: ComponentFixture<CartOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

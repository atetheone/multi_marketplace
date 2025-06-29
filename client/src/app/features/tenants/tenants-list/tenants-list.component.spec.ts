import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsListComponent } from './tenants-list.component';

describe('TenantsListComponent', () => {
  let component: TenantsListComponent;
  let fixture: ComponentFixture<TenantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTransactionComponent } from './home-transaction.component';

describe('HomeTransactionComponent', () => {
  let component: HomeTransactionComponent;
  let fixture: ComponentFixture<HomeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

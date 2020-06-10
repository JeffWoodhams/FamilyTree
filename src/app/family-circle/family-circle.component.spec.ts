import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyCircleComponent } from './family-circle.component';

describe('FamilyCircleComponent', () => {
  let component: FamilyCircleComponent;
  let fixture: ComponentFixture<FamilyCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpurityFormComponent } from './impurity-form.component';

describe('ImpurityFormComponent', () => {
  let component: ImpurityFormComponent;
  let fixture: ComponentFixture<ImpurityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpurityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpurityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

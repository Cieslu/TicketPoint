import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerHomeComponent } from './worker-home.component';

describe('HomeComponent', () => {
  let component: WorkerHomeComponent;
  let fixture: ComponentFixture<WorkerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

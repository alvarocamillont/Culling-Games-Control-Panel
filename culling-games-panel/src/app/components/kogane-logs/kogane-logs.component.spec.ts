import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KoganeLogsComponent } from './kogane-logs.component';

describe('KoganeLogsComponent', () => {
  let component: KoganeLogsComponent;
  let fixture: ComponentFixture<KoganeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KoganeLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KoganeLogsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('logs', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

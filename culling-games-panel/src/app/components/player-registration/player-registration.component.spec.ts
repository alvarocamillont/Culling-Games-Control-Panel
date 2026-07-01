import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerRegistrationComponent } from './player-registration.component';

describe('PlayerRegistrationComponent', () => {
  let component: PlayerRegistrationComponent;
  let fixture: ComponentFixture<PlayerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerRegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRegistrationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial default form values', () => {
    const form = (component as any).registrationForm;
    expect(form().value().name).toBe('');
    expect(form().value().colony).toBe('Tokyo Colony No. 1');
    expect(form().value().points).toBe(0);
    expect(form().value().status).toBe('Alive');
    expect(form().invalid()).toBe(true); // Name is empty and required
  });

  it('should validate name required', async () => {
    const form = (component as any).registrationForm;
    const nameInput = fixture.nativeElement.querySelector('input[placeholder="e.g., Hajime Kashimo"]');
    
    form.name().markAsTouched();
    await fixture.whenStable();
    
    let errorDiv = fixture.nativeElement.querySelector('div.text-red-500');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.textContent).toContain('Sorcerer Name is required.');

    nameInput.value = 'Maki Zenin';
    nameInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(form.name().valid()).toBe(true);
    expect(form().invalid()).toBe(false);
  });

  it('should validate points range [0, 1000]', async () => {
    const form = (component as any).registrationForm;
    const pointsInput = fixture.nativeElement.querySelector('input[type="number"]');

    pointsInput.value = '-5';
    pointsInput.dispatchEvent(new Event('input'));
    form.points().markAsTouched();
    await fixture.whenStable();

    expect(form.points().invalid()).toBe(true);
    let errorDiv = fixture.nativeElement.querySelector('div.text-red-500');
    expect(errorDiv.textContent).toContain('Points cannot be negative.');

    pointsInput.value = '1005';
    pointsInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(form.points().invalid()).toBe(true);
    errorDiv = fixture.nativeElement.querySelector('div.text-red-500');
    expect(errorDiv.textContent).toContain('Points cannot exceed 1000.');

    pointsInput.value = '100';
    pointsInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(form.points().valid()).toBe(true);
  });

  it('should emit playerRegistered event on valid submit and reset form', async () => {
    let emitted: any = null;
    component.playerRegistered.subscribe(val => {
      emitted = val;
    });

    const form = (component as any).registrationForm;
    // Set the form model signal directly (Signal Forms are model-driven)
    (component as any).model.set({
      name: 'Maki Zenin',
      colony: 'Sendai Colony',
      technique: 'Heavenly Restriction',
      points: 50,
      status: 'Alive'
    });

    await fixture.whenStable();

    expect(form().valid()).toBe(true);

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(false);

    submitBtn.click();
    await fixture.whenStable();

    expect(emitted).toEqual({
      name: 'Maki Zenin',
      colony: 'Sendai Colony',
      technique: 'Heavenly Restriction',
      points: 50,
      status: 'Alive'
    });

    expect(form().value().name).toBe('');
    expect(form().value().points).toBe(0);
  });
});

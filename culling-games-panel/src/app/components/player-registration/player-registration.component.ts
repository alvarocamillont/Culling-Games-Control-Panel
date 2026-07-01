import { Component, output, signal } from '@angular/core';
import {
  form,
  FormField,
  submit,
  required,
  min,
  max
} from '@angular/forms/signals';
import { Sorcerer } from '../../models';

@Component({
  selector: 'app-player-registration',
  standalone: true,
  imports: [FormField],
  templateUrl: './player-registration.component.html',
  styleUrls: ['./player-registration.component.css']
})
export class PlayerRegistrationComponent {
  readonly playerRegistered = output<Omit<Sorcerer, 'id'>>();

  protected readonly model = signal({
    name: '',
    colony: 'Tokyo Colony No. 1',
    technique: '',
    points: 0,
    status: 'Alive' as 'Alive' | 'Deceased'
  });

  protected readonly registrationForm = form(this.model, (s) => {
    required(s.name, { message: 'Sorcerer Name is required.' });
    required(s.colony, { message: 'Starting Colony is required.' });
    required(s.status, { message: 'Initial Status is required.' });
    min(s.points, 0, { message: 'Points cannot be negative.' });
    max(s.points, 1000, { message: 'Points cannot exceed 1000.' });
  });

  onSubmit() {
    submit(this.registrationForm, async () => {
      const val = this.model();
      this.playerRegistered.emit({
        name: val.name.trim(),
        colony: val.colony,
        technique: val.technique.trim(),
        points: val.points,
        status: val.status
      });

      this.model.set({
        name: '',
        colony: 'Tokyo Colony No. 1',
        technique: '',
        points: 0,
        status: 'Alive'
      });
      this.registrationForm().reset();
    });
  }
}

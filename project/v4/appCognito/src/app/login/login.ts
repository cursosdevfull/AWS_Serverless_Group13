import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Cognito } from '../cognito';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  fg: FormGroup
  cognitoService = inject(Cognito);

  constructor() {
    this.fg = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  signIn() {
    if (this.fg.valid) {
      this.cognitoService.signIn(this.fg.value.email, this.fg.value.password);
    }
  }
}

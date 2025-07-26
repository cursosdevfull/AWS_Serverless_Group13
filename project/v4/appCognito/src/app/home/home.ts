import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cognito } from '../cognito';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, JsonPipe, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  fg: FormGroup
  result = {}
  cognitoService = inject(Cognito);
  http = inject(HttpClient);

  constructor() {
    this.fg = new FormGroup({
      patientId: new FormControl(null, Validators.required),
      scheduleId: new FormControl(null, Validators.required),
      countryISO: new FormControl(null, [Validators.required, this.validateISO]),
    });
  }

  createAppointment() {
    if (this.fg.valid) {
      const value = this.fg.value;
      const token = sessionStorage.getItem("token")!;

      console.log("Token", token);
      console.log("Value", value);

      this.http.post("https://fzr4x8b3v6.execute-api.us-east-1.amazonaws.com/dev/appointment", value, {
        headers: {
          Authorization: token
        }
      })
        .subscribe({
          next: response => this.result = response,
          error: error => console.log("Error", error)
        })
    }


  }

  signOut() {
    this.cognitoService.signOut()
  }

  validateISO(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    const iso = control.value as string;
    if (iso.length !== 2) {
      return { invalidISO: true };
    }

    if (["PE", "CO", "MX"].includes(iso)) {
      return null;
    }

    return { invalidISO: true };
  }
}

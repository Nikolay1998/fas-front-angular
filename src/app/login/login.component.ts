import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: String = "";

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (e) => {
          if (e == "OK") {
            this.error = "Invalid username or password"
          }
        },
      })
  }

  signUp() {
    let newUser: User = {
      id: "",
      password: this.f['password'].value,
      username: this.f['username'].value,
    }
    this.authenticationService.register(newUser)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (e) => {
          this.error = e
        }
      })
  }

}

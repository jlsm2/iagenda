import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage = '';

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.apiService.login({ email: email!, password: password! }).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!');

          // ✅ Salva o ID do usuário no localStorage
          if (response.userId || response.user_id) {
            localStorage.setItem('userId', response.userId ?? response.user_id);
          } else {
            console.warn('⚠️ Login retornou sucesso mas sem userId!');
          }

          this.router.navigate(['/planner']);
        },
        error: (err: any) => {
          console.error('Erro ao fazer login:', err);
          this.errorMessage = err.error?.error || 'Falha ao fazer login.';
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

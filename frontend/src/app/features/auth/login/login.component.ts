import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  onSubmit() {
    // A validação do formulário pode ser mais complexa aqui no futuro
    // (ex: chamar um serviço de autenticação)
    if (this.loginForm.valid) {
      console.log('Login bem-sucedido! Navegando para o planner...');
      
      // --- CORREÇÃO AQUI ---
      // Navega para a rota '/planner' que definimos no app.routes.ts
      this.router.navigate(['/planner']);

    } else {
      console.log('Formulário de login inválido.');
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Para formulários reativos
import { Router } from '@angular/router'; // Importar o Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,         // Adicionado CommonModule
    ReactiveFormsModule   // Adicionado ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // Injetar o Router no construtor
  constructor(private router: Router) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Dados do Login:', this.loginForm.value);
      // Aqui você implementaria a lógica de autenticação,
      // por exemplo, chamando um serviço de autenticação:
      // this.authService.login(this.loginForm.value).subscribe(
      //   response => {
      //     /* Lógica de sucesso */
      //     this.router.navigate(['/test']); // Redireciona após sucesso
      //   },
      //   error => { /* Lógica de erro */ }
      // );

      // Para este exemplo, vamos redirecionar diretamente após a validação do formulário
      this.router.navigate(['/test']);
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

  // Getters para acesso fácil aos controles no template (para validação, etc.)
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

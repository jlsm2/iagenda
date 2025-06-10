import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Função de validação customizada para checar se as senhas coincidem
export function passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // Importa o RouterLink para o link "Faça seu Login"
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  cadastroForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    nickname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMismatchValidator }); // Adiciona o validador no grupo do formulário

  constructor(private router: Router) {}

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Dados do Cadastro:', this.cadastroForm.value);
      // Lógica para enviar os dados para o backend
      // this.authService.register(this.cadastroForm.value).subscribe(...)
      
      // Redireciona para a tela de login ou dashboard após o cadastro
      this.router.navigate(['/login']);
    } else {
      console.log('Formulário de cadastro inválido.');
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.values(this.cadastroForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Getters para fácil acesso no template
  get fullName() { return this.cadastroForm.get('fullName'); }
  get nickname() { return this.cadastroForm.get('nickname'); }
  get email() { return this.cadastroForm.get('email'); }
  get phone() { return this.cadastroForm.get('phone'); }
  get password() { return this.cadastroForm.get('password'); }
  get confirmPassword() { return this.cadastroForm.get('confirmPassword'); }
}
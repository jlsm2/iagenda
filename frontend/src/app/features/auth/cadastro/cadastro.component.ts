import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api-service';

export function passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink ],
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
  }, { validators: passwordMismatchValidator });

  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit() {
    if (this.cadastroForm.valid) {
      const { email, password } = this.cadastroForm.value;
      this.apiService.register({ email: email!, password: password! }).subscribe({
        next: () => {
          this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para login...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar:', err);
          this.errorMessage = err.error?.error || 'Falha ao cadastrar.';
          this.successMessage = '';
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched() {
    Object.values(this.cadastroForm.controls).forEach(control => control.markAsTouched());
  }

  get fullName() { return this.cadastroForm.get('fullName'); }
  get nickname() { return this.cadastroForm.get('nickname'); }
  get email() { return this.cadastroForm.get('email'); }
  get phone() { return this.cadastroForm.get('phone'); }
  get password() { return this.cadastroForm.get('password'); }
  get confirmPassword() { return this.cadastroForm.get('confirmPassword'); }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpService } from '../../../core/services/http.service';
import { DialogService } from '../../../private/modules/dashboard/services/dialog.service';
import { AuthService, ILogin } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-public-login-page',
  templateUrl: './component.html',
  styleUrl: './component.scss',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class PublicLoginPage {
    form  = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  
    public matcher = new ErrorStateMatcher();
    
    public emailFormControl = this.form.get('email') as FormControl;
    public passwordFormControl = this.form.get('password') as FormControl;
    readonly #httpService =inject(HttpService);
    readonly #dialogService = inject(DialogService);
    readonly #authService = inject(AuthService);
    readonly #router: Router = inject(Router);


    login() {
      if (this.form.invalid) {
        return;
      }

      const user: ILogin = {
        email: (this.form.value as { email: string; password: string }).email ?? '',
        password: (this.form.value as { email: string; password: string }).password ?? '',
      };      

        this.#authService.login(user).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.jWtoken);
          this.#router.navigate(['/in']);
        },
        error: (error) => {
          if (error.status === 403 || error.status === 400) {
            this.#dialogService.openDialogSuccess({
              type: 'error',
              text: 'Usuario o contraseña incorrectos',
            });
          } else {
            this.#dialogService.openDialogSuccess({
              type: 'error',
              text: 'Ha ocurrido un error al intentar iniciar sesión',
            });
          }
        },
        complete: () => {
          this.form.reset();
        }
      });
    }
  

  }


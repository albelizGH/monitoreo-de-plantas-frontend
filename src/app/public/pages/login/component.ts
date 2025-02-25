import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { MatIcon } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-public-login-page',
  templateUrl: './component.html',
  styleUrl: './component.scss',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatIcon],
})
export class PublicLoginPage {
    form  = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    public hide = true;
    public readonly badRequest = signal<{passwordEmail: boolean,error: boolean}>({passwordEmail: false,error: false});
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

      this.badRequest.set({passwordEmail: false, error: false});

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
            this.badRequest.set({passwordEmail: true, error: false});
          } else {
            this.badRequest.set({passwordEmail: false, error: true});
          }
        },
        complete: () => {
          this.form.reset();
        }
      });
    }

    hidePassword(): void {
      this.hide = !this.hide;
    }
  

  }


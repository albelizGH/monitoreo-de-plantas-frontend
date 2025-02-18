import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { repeat } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../../core/services/http.service';
import { DialogService } from '../../../private/modules/dashboard/services/dialog.service';

interface IRegisterUser {
  user: string;
  email: string;
  password: string;
}


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-public-register-page',
  templateUrl: './component.html',
  styleUrl: './component.scss',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class PublicRegisterPage {

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[@$!%*?&]).{8,}$/)]),
    repeat: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[@$!%*?&]).{8,}$/)]),
    username: new FormControl('', [Validators.required]),
  });

  public matcher = new ErrorStateMatcher();

  public emailFormControl = this.form.get('email') as FormControl;
  public passwordFormControl = this.form.get('password') as FormControl;
  public repeatFormControl = this.form.get('repeat') as FormControl;
  public userFormControl = this.form.get('username') as FormControl;
  readonly #httpService = inject(HttpService);
  readonly #dialogService = inject(DialogService);

  registre() {
    if(!this.form.valid || !this.passwordMatchValidator()) {
      return;
    }
    this.#httpService.post('auth/register', this.form.value).subscribe({
      next: (response) => {
        this.#dialogService.openDialogSuccess({
          type: 'success',
          text: 'Usuario registrado exitosamente',
        });
      },
      error: (error) => {
        this.#dialogService.openDialogSuccess({
          type: 'error',
          text: 'Ha ocurrido un error al intentar registrar el usuario',
        });
      },
      complete: () => {
        this.form.reset();
      }
    });
  }


    public passwordMatchValidator():boolean {
      if (this.form.get('password')?.value !== this.form.get('repeat')?.value) {
        this.form.get('repeat')?.setErrors({ passwordMatch: true });
        return false;
      } else {
        this.form.get('repeat')?.setErrors(null);
        return true;
      }
    }
    
}

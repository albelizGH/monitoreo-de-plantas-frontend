import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';

export interface IToken{
  jWtoken: string;
}

export interface ILogin {
	email: string;
	password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #httpService = inject(HttpService);
  readonly #router: Router = inject(Router); 

	login(credenciales: ILogin): Observable<IToken> {
		return this.#httpService.post<ILogin, IToken>('auth/login', credenciales);
	}

	getToken(): string | null {
		return localStorage.getItem('token') ? localStorage.getItem('token') : null;
	}

	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('rol');
    this.#router.navigate(['']);
	}

	isAuthenticated(): boolean {
		return this.getToken() !== null;
	}
}


import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}


	login(credenciales: ILogin): Observable<IToken> {
		return this.#httpService.post<ILogin, IToken>('auth/login', credenciales);
	}

  //Evita que se rompa al no estar dipsponible el localstorage cuando se renderiza en el servidor
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') || null;
    }
    return null;
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


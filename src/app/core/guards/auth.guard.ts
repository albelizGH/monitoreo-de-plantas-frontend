import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	readonly #auth: AuthService = inject(AuthService);
	readonly #router: Router = inject(Router);

	canActivate(): boolean {
		if (this.#auth.isAuthenticated()) {
			return true;
		} else {
			this.#router.navigate(['']);
			return false;
		}
	}
}

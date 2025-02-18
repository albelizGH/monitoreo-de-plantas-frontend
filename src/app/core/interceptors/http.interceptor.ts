import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
	
  const authService: AuthService = inject(AuthService);
	
  const token: string | null = authService.getToken();

	if (token) {
		req = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}
	return next(req);
};

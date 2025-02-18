import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  readonly #http: HttpClient = inject(HttpClient);
	readonly #env = environment;

	public get env(): typeof environment {
		return this.#env;
	}

	public get<T, P>(endpoint: string, params?: P): Observable<T> {
		return params ? this.#http.get<T>(`${this.#env.api}${endpoint}`, { params: params }) : this.#http.get<T>(`${this.#env.api}${endpoint}`);
	}

	public list<T, P>(endpoint: string, params?: P): Observable<T[]> {
		return params
			? this.#http.get<T[]>(`${this.#env.api}${endpoint}`, { params: params })
			: this.#http.get<T[]>(`${this.#env.api}${endpoint}`);
	}

	public post<T, R>(endpoint: string, body: T): Observable<R> {
		return this.#http.post<R>(`${this.#env.api}${endpoint}`, body);
	}

	public delete<T, P>(endpoint: string, params?: P): Observable<T> {
		return params
			? this.#http.delete<T>(`${this.#env.api}${endpoint}`, { params: params })
			: this.#http.delete<T>(`${this.#env.api}${endpoint}`);
	}

	public patch<T>(endpoint: string, body: T): Observable<T> {
		return this.#http.patch<T>(`${this.#env.api}${endpoint}`, body);
	}

  public put<T>(endpoint: string, body: T): Observable<T> {
      return this.#http.put<T>(`${this.#env.api}${endpoint}`, body);
  }

}

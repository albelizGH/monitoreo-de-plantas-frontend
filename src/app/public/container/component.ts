import type { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatIconModule],
  selector: 'app-public-container',
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class PublicContainer implements OnInit {
  public currentInfo = { title: '', description: '' };

  private readonly information = {
    login: {
      title: 'Iniciar sesión',
      description: 'Nos alegra tenerte de vuelta y estamos listos para atender tus necesidades. Inicia sesión y continúa aprovechando al máximo nuestra plataforma.',
    },
    register: {
      title: 'Registrarse',
      description:
        '¡Bienvenido! Estamos encantados de que quieras unirte a nuestra plataforma. Regístrate y comienza a disfrutar de todas las ventajas que ofrecemos. No pierdas la oportunidad de ser parte de nuestra comunidad.',
    },
  };

  readonly #router = inject(Router);

  public ngOnInit(): void {
    const urlSegment = this.#router.url.includes('register') ? 'register' : 'login';
    this.currentInfo = this.information[urlSegment];
  }

  }
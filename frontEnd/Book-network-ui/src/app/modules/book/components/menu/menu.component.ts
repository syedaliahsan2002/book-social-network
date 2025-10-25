import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from '../../../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'] // corrected property name
})
export class MenuComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any,
  private keycloakService: KeycloakService
) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const linkColor = document.querySelectorAll('.nav-link');
      linkColor.forEach(link => {
        if (window.location.href.endsWith(link.getAttribute('href') || '')) {
          link.classList.add('active');
        }
        link.addEventListener('click', () => {
          linkColor.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        });
      });
    }
  }

  async register() {
    await this.keycloakService.register();
  }

  async logout() {
    await this.keycloakService.logout();
  }
  async accountManagment() {
    await this.keycloakService.accountManagment();
  }
}

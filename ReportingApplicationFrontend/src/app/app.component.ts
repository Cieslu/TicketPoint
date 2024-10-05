import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IsLoggedService } from './services/is_logged/is-logged.service';
import { ErrorComponent } from './components/error/error.component';
import { ErrorService } from './services/error/error.service';
import { SuccessComponent } from './components/success/success.component';
import { SuccessService } from './services/success/success.service';
import { RoleService } from './services/role/role.service';
import { LogoutService } from './services/logout/logout.service';
import { map, take } from 'rxjs';
import { NgStyle } from '@angular/common';
import { DecodeTokenService } from './services/decode_token/decode-token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ErrorComponent, SuccessComponent, RouterLinkActive, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'TicketPoint';
  userName: string = "";
  adminColor: string = "";
  role: boolean = false;
  is_logged: boolean = false;

  //Pola te obsługują alerty
  error: number = 0;
  success: number = 0;
  error_is_visible: boolean = false;
  success_is_visible: boolean = false;

  constructor(
    private isLoggedService: IsLoggedService,
    private router: Router,
    private errorService: ErrorService,
    private successService: SuccessService,
    private roleService: RoleService,
    private logoutService: LogoutService,
    private decodeTokenService: DecodeTokenService
  ) { }

  ngOnInit(): void {
    //this.isLoggedService.isLogged();

    this.isLoggedService.getIsLogged().subscribe({
      next: (x: boolean) => {
        this.is_logged = x;
        if (x) {
          this.role = this.decodeTokenService.getRoleFromToken() === "Administrator" ? true : false;//Gdy rola to "Administrator", role jest ustawiane na true, w przeciwnym wypadku jest false

          if (this.role) {
            this.adminColor = this.decodeTokenService.getColorFromToken()!;
          }

          this.userName = this.decodeTokenService.getNameFromToken()!;
        }
      }
    });

    // if(this.decodeTokenService.getAccessToken() !== null){
    //   this.is_logged = true;
    //   this.role = this.decodeTokenService.getRoleFromToken() === "Administrator" ? true : false;//Gdy rola to "Administrator", role jest ustawiane na true, w przeciwnym wypadku jest false

    //   if(this.role){
    //     this.adminColor = this.decodeTokenService.getColorFromToken()!;
    //   }

    //   this.userName = this.decodeTokenService.getNameFromToken()!;
    // }

    this.errorService.getError().subscribe({
      next: (x: number) => { this.error = x }
    });

    this.successService.getSuccess().subscribe({
      next: (x: number) => { this.success = x }
    });

    this.errorService.getVisible().subscribe({
      next: (x: boolean) => { this.error_is_visible = x }
    });

    this.successService.getVisible().subscribe({
      next: (x: boolean) => { this.success_is_visible = x }
    });
  }

  logout() {
    this.logoutService.logout();
  }
}

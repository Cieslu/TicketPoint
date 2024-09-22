import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IsLoggedService } from './services/is_logged/is-logged.service';
import { ErrorComponent } from './components/error/error.component';
import { ErrorService } from './services/error/error.service';
import { SuccessComponent } from './components/success/success.component';
import { SuccessService } from './services/success/success.service';
import { RoleService } from './services/role/role.service';
import { LogoutService } from './services/logout/logout.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ErrorComponent, SuccessComponent, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Ticket App';
  userName: string = "";
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
    private logoutService: LogoutService
  ){}
  
  ngOnInit(): void {
    this.isLoggedService.getIsLogged().subscribe({
      next: (x: boolean) => {
        this.is_logged = x;
        if(x){
          this.role = this.isLoggedService.takeRoleFromToken() === "Administrator" ? true : false;//Gdy rola to "Administrator", role jest ustawiane na true, w przeciwnym wypadku jest false // Tutaj jest błąd!!!!!!!!!!!!!!!!!!!

          // this.roleService.getRole().subscribe({//Sprawdzanie czy użytkownik ma role "Administrator"
          //   next: (y: boolean) => {
          //     this.role = y;
          //   }
          // });

          this.userName = this.isLoggedService.takeNameFromToken();
        }
      }
    });

    this.errorService.getError().subscribe({
      next: (x: number) => {this.error = x}
    });

    this.successService.getSuccess().subscribe({
      next: (x: number) => {this.success = x}
    });

    this.errorService.getVisible().subscribe({
      next: (x: boolean) => {this.error_is_visible = x}
    });
    
    this.successService.getVisible().subscribe({
      next: (x: boolean) => {this.success_is_visible = x}
    });
  }

  logout(){
    this.logoutService.logout();
  }
}

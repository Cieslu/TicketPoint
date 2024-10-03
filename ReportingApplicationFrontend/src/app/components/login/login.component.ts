import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { LoginRequest } from '../../models/loginRequest';
import { AccessToken } from '../../models/accessToken';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ErrorService } from '../../services/error/error.service';
import { ErrorComponent } from '../error/error.component';
import { SuccessService } from '../../services/success/success.service';
import { NgClass } from '@angular/common';
import { RoleService } from '../../services/role/role.service';
import { map, Subscription, take } from 'rxjs';
import { DecodeTokenService } from '../../services/decode_token/decode-token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SpinnerComponent, ErrorComponent, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private subscriptionSpinner: Subscription = new Subscription();
  private subscriptionLogin: Subscription = new Subscription();
  loginRequest: LoginRequest = new LoginRequest("","");
  isLoading$: boolean = false;
  error: number = 0;
  role$: boolean = false;

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private spinnerService: SpinnerService, 
    private errorService: ErrorService,
    private successService: SuccessService,
    private isLoggedService: IsLoggedService,
    private roleService: RoleService,
    private decodeTokenService: DecodeTokenService

  ){}

  ngOnDestroy(): void {
    this.subscriptionSpinner.unsubscribe();
    this.subscriptionLogin.unsubscribe();
  }
  
  login(loginForm: NgForm) {
    const userNameValid = loginForm.controls['userName'].valid;//Walidacja formularza
    const passwordValid = loginForm.controls['password'].valid;//Walidacja formularza
    
    if (userNameValid && passwordValid) {
      
      this.subscriptionLogin = this.loginService.login(this.loginRequest).subscribe({
        next: (res: AccessToken) => {
          this.decodeTokenService.setTokenAndClaimsFromToken(res.accessToken);
          //localStorage.setItem("accessToken", res.accessToken);//Umieszczenie tokenu w localstorage
       
          this.spinnerService.setLoading(false);//Wyłączenie spinnera
          this.isLoggedService.setIsLogged(true);

          const role = this.decodeTokenService.getRoleFromToken();

          if(role === "Administrator"){
            this.router.navigate(['/administrator/home']);//Przekierowanie do strony home (to jest dla admina)
          }else if(role === "Worker"){
            this.router.navigate(['/worker/home']);//Przekierowanie do strony home (to jest dla pracownika)
          }

          // this.roleService.checkRole(this.isLoggedService.takeIdFromToken()).subscribe({//Sprawdzanie czy logujący się użytkownik jest Administratorem
          //   next: (res: string[]) => {
          //     res.map(x => x.includes("Administrator") ? (this.roleService.setRole(true), this.role$ = true) : this.roleService.setRole(false));
          //     if(this.role$){
          //       console.log("xd" + this.role$);
                
          //       this.router.navigate(['/administrator/home']);//Przekierowanie do strony home (to jest dla pracownika)
          //     }else{
          //       console.log("xd" + this.role$);
          //       // this.router.navigate(['/worker_home']);//Przekierowanie do strony home (to jest dla pracownika)
          //       this.router.navigate(['/home']);//Przekierowanie do strony home (to jest dla pracownika)
          //     }
          //   },
          //   error: () => {
          //     console.log("Nie" + this.role$);
          //     this.roleService.setRole(false);
          //   }
          // });
        },
        error: () => {
          this.successService.removeSuccess();
          this.errorService.setError(-2, null);//Wywołanie błędu
          this.spinnerService.setLoading(false);//Wyłączenie spinnera
        }
      });
    }
  }
  
  loading() { //Subskrybcja zmiennej obserowalnej z usługi spinnera
    this.subscriptionSpinner = this.spinnerService.loading().subscribe(x => this.isLoading$ = x);
  }
}

import { Injectable } from '@angular/core';
import { IsLoggedService } from '../is_logged/is-logged.service';
import { SuccessService } from '../success/success.service';
import { Router } from '@angular/router';
import { RoleService } from '../role/role.service';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private isLoggedService: IsLoggedService,
    private roleService: RoleService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private router: Router 
  ) { }

  logout(){
    localStorage.removeItem("accessToken");
    this.isLoggedService.setIsLogged(false);
    //this.roleService.setRole(false);
    this.successService.setSuccess(2, "");
    this.router.navigate(['login']);
  }

  logoutErr401(){
    localStorage.removeItem("accessToken");
    this.isLoggedService.setIsLogged(false);
    //this.roleService.setRole(false);
    this.errorService.setError(-1, "");
    this.successService.removeSuccess();
    this.router.navigate(['login']);
  }
}

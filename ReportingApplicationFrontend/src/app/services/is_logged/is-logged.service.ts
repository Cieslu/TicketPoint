import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { ErrorService } from '../error/error.service';

import { SuccessService } from '../success/success.service';
import { DecodeTokenService } from '../decode_token/decode-token.service';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../role/role.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedService {

  private is_logged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private errorService: ErrorService,
    private successService: SuccessService,
    private decodeToken: DecodeTokenService,
    private roleService: RoleService
  ) { }

  isLogged(): void {
    const decodeToken = this.decodeToken.getDecodedAccessToken(this.takeToken());
    if(!decodeToken){
      localStorage.removeItem("accessToken");
      this.setIsLogged(false);
      //this.roleService.setRole(false);
    }else{
      this.checkExpiration(decodeToken.exp);
    }
  }
  
  checkExpiration(exp: number): void{
    if(Date.now() >= exp * 1000){//Sprawdzenie czy token już wygasł
      localStorage.removeItem("accessToken");
      this.setIsLogged(false);
      //this.roleService.setRole(false);
    }else{
      this.setIsLogged(true);
      this.errorService.removeError();
      this.successService.removeSuccess();
    }
  }

  getIsLogged(): Observable<boolean> {
    return this.is_logged$.asObservable();
  }

  setIsLogged(x: boolean): void {
    this.is_logged$.next(x);
  }

  takeToken(): string | null{
    return localStorage.getItem("accessToken");
  } 

  takeNameFromToken(): string{
    return this.decodeToken.getDecodedAccessToken(localStorage.getItem("accessToken")).name;
  }

  takeIdFromToken(): string{
    return this.decodeToken.getDecodedAccessToken(localStorage.getItem("accessToken")).id;
  }

  takeRoleFromToken(): string{
    return this.decodeToken.getDecodedAccessToken(localStorage.getItem("accessToken")).role;
  }
}
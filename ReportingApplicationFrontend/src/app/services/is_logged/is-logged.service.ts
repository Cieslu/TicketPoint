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
    private decodeTokenService: DecodeTokenService,
    private roleService: RoleService
  ) { }

  isLogged(): void {
    const decodeToken = this.decodeTokenService.getAccessToken();
    if(!decodeToken){
      localStorage.clear();
      this.setIsLogged(false);
    }else{
      this.checkExpiration(this.decodeTokenService.getExpFromToken()!);
    }
  }
  
  checkExpiration(exp: number): void{
    if(isNaN(exp)){
      localStorage.clear();
      this.setIsLogged(false);
    }else{
      if(Date.now() >= exp * 1000){//Sprawdzenie czy token już wygasł
        localStorage.clear();
        this.setIsLogged(false);
      }else{
        this.setIsLogged(true);
        this.errorService.removeError();
        this.successService.removeSuccess();
      }
    }
  }

  getIsLogged(): Observable<boolean> {
    return this.is_logged$.asObservable();
  }

  setIsLogged(x: boolean): void {
    this.is_logged$.next(x);
  }
}
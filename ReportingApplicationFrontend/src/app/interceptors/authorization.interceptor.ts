import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { ErrorService } from '../services/error/error.service';
import { inject } from '@angular/core';
import { IsLoggedService } from '../services/is_logged/is-logged.service';
import { Router } from '@angular/router';
import { RoleService } from '../services/role/role.service';
2
export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const isLoggedService = inject(IsLoggedService);
  const roleServie = inject(RoleService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  let authReq: HttpRequest<unknown> = req;
  let is_logged$: boolean = false; 

  if(!req.url.includes('login')){
    isLoggedService.isLogged();//Sprawdzanie czy użytkownik jest zalogowany

    isLoggedService.getIsLogged().subscribe(x => {
      is_logged$ = x;
    });
  
    if(is_logged$){
      const authToken = isLoggedService.takeToken();
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
  }

  return next(authReq);
};

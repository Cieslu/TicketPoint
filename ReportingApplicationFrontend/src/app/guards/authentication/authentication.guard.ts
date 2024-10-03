import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { map, of, switchMap, take, tap } from 'rxjs';
import { ErrorService } from '../../services/error/error.service';
import { RoleService } from '../../services/role/role.service';
import { DecodeTokenService } from '../../services/decode_token/decode-token.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const isLoggedService = inject(IsLoggedService);
  const router = inject(Router);
  const errorService = inject(ErrorService);
  const roleService = inject(RoleService);
  const decodeTokenService = inject(DecodeTokenService);

  const role = route.data['role'];
  isLoggedService.isLogged();//Sprawdzanie czy użytkownik jest zalogowany

  return isLoggedService.getIsLogged().pipe(
    take(1),
    switchMap(is_logged => {
      if (!is_logged) {
        errorService.setError(-1, null);
        router.navigate(['/login']);
        return of(false);
      }

      if(role === undefined){
        return of(true);  
      }

      return roleService.checkRole(decodeTokenService.getIdFromToken()!).pipe(//Sprawdzanie czy użytkownik jest Administratorem
        take(1),
        map(x => {
          if (x.includes(decodeTokenService.getRoleFromToken()!) && x.includes(role)) {
            return true;
          }
          else {
            router.navigate(['page-forbidden']);
            return false;
          }
        })
      );
    })
  );
};

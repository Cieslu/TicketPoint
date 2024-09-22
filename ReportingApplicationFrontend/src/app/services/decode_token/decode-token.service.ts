import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {

  constructor() { }

  getDecodedAccessToken(token: string | null): any {
    return token !== null ? jwtDecode(token) : null;
  }
}

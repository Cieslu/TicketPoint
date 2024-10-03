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

  setTokenAndClaimsFromToken(accessToken: string): void{
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("name", this.getDecodedAccessToken(accessToken).name);
    localStorage.setItem("userName", this.getDecodedAccessToken(accessToken).userName);
    localStorage.setItem("color", this.getDecodedAccessToken(accessToken).color);
    localStorage.setItem("id", this.getDecodedAccessToken(accessToken).id);
    localStorage.setItem("role", this.getDecodedAccessToken(accessToken).role);
    localStorage.setItem("exp", this.getDecodedAccessToken(accessToken).exp);
  }
  
  getAccessToken(): string | null{
    return localStorage.getItem("accessToken");
  } 

  getNameFromToken(): string | null{
    return localStorage.getItem("name");
  }

  getUserNameFromToken(): string | null{
    return localStorage.getItem("userName");
  }

  getColorFromToken(): string | null{
    return localStorage.getItem("color");
  }

  getIdFromToken(): string | null{
    return localStorage.getItem("id");
  }

  getRoleFromToken(): string | null{
    return localStorage.getItem("role");
  }

  getExpFromToken(): number | null{
    return  parseInt(localStorage.getItem("exp")!);
  }
}

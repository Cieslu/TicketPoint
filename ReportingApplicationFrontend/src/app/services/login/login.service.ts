import { Injectable } from '@angular/core';
import { LoginRequest } from '../../models/loginRequest';
import { LoginRequestDTO } from '../../modelsDTO/loginRequestDTO';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, shareReplay } from 'rxjs';
import { AccessTokenDTO } from '../../modelsDTO/accessTokenDTO';
import { AccessToken } from '../../models/accessToken';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //api: string = "http://localhost:5284/api/Login"; //Korner
  api: string = "https://localhost:44385/api/Login"; //Dom
  
  
  constructor(
    private httpClient: HttpClient
  ) { }

  login(loginRequest: LoginRequest): Observable<AccessTokenDTO>{
    return this.httpClient.post<AccessTokenDTO>(`${this.api}/login`, this.toLoginRequestDTO(loginRequest));
  }

  
  toLoginRequestDTO(loginRequest: LoginRequest): LoginRequestDTO{
    return new LoginRequestDTO(loginRequest.userName, loginRequest.password);
  }

  toAccessToken(accessTokenDTO: AccessTokenDTO): AccessToken{
    return new AccessToken(accessTokenDTO.accessToken);
  }
}

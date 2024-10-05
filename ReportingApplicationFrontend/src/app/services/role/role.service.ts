import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  api: string = "https://localhost:44385/api/Role"; //Dom

  private is_administrator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient 
  ) { }

  checkRole(userId:string): Observable<string[]>{
    return this.httpClient.get<string[]>(`${this.api}/role/${userId}`);
  }

  // setRole(is_a: boolean){
  //   this.is_administrator$.next(is_a);
  // }

  // getRole(){
  //   return this.is_administrator$.asObservable();
  // }
}

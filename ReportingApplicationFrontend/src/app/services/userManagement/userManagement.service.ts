import { HttpBackend, HttpClient, HttpEvent, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../../modelsDTO/userDTO';
import { Observable, shareReplay } from 'rxjs';
import { User } from '../../models/user';
import { ChangePasswordDTO } from '../../modelsDTO/changePasswordDTO';
import { ChangePassword } from '../../models/changePassword';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  //api: string = "http://localhost:5284/api/Administrator"; //Korner
  api: string = "https://localhost:44385/api/administrator/UserManagement"; //Dom


  constructor(
    private httpClient: HttpClient
  ) { }

  addUser(user: User): Observable<UserDTO> {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' }
    }
    return this.httpClient.post<UserDTO>(`${this.api}/addUser`, this.toUserDTO(user), httpOptions);
  }

  editUser(user: User): Observable<HttpStatusCode>{
    return this.httpClient.put<HttpStatusCode>(`${this.api}/editUser`, this.toUserDTO(user));
  }

  showUsers(): Observable<UserDTO[]>{
    return this.httpClient.get<UserDTO[]>(`${this.api}/showUsers`);
  }

  deleteUser(user: User): Observable<HttpStatusCode>{
    return this.httpClient.delete<HttpStatusCode>(`${this.api}/deleteUser/${user.id}`);
  }

  lockOrUnlockUser(user: User): Observable<HttpStatusCode>{
    return this.httpClient.get<HttpStatusCode>(`${this.api}/lockOrUnlockUser/${user.id}`);
  }

  editPassword(changePassword: ChangePassword): Observable<HttpStatusCode>{
    return this.httpClient.put<HttpStatusCode>(`${this.api}/editPassword`, this.toChangePasswordDTO(changePassword));
  }


  toUser(userDTO: UserDTO): User{
    return new User(userDTO.id, userDTO.firstName, userDTO.lastName, userDTO.userName, userDTO.email, userDTO.password, userDTO.branch, userDTO.signature, userDTO.isAdministrator, userDTO.locked, userDTO.adminColor);
  }

  toUserDTO(user: User): UserDTO {
    return new UserDTO(user.id, user.firstName, user.lastName, user.userName, user.email, user.password, user.branch, user.signature, user.isAdministrator, user.locked, user.adminColor);
  }
  
  toChangePasswordDTO(changePassword: ChangePassword): ChangePasswordDTO{
    return new ChangePasswordDTO(changePassword.userId, changePassword.password1, changePassword.password2);
  }
}

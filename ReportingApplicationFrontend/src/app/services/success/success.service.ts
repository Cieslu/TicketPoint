import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class SuccessService {

  // 0 - wartość domyślna
  // 2 - Pomyślnie wylogowano z aplikacji Korner Report! (app.component.ts)
  // 3 - Pomyślnie dodano użytkownika. (modal.component.ts)
  // 4 - Pomyślnie usunięto użytkownika. (modal.component.ts)
  // 5 - Pomyślnie zaktualizowano użytkownika. (modal.component.ts)
  // 6 - Pomyślnie zablokowano użytkownika. (modal.component.ts)
  // 7 - Pomyślnie odblokowano użytkownika. (modal.component.ts)
  // 8 - Pomyślnie zmieniono hasło użytkownika. (modal.component.ts)
  // 9 - Pomyślnie utworzono zgłoszenie. (modal.component.ts)
  
  private is_success$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private succes_is_visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private name: string = "Nie zdefiniowano";

  constructor() {}

  getSuccess(): Observable<number> {
    return this.is_success$.asObservable();
  }

  getVisible(): Observable<boolean>{
    return this.succes_is_visible$.asObservable();
  }

  getName(){
    return this.name;
  }

  setSuccess(succ: number, n: string): void {
    this.is_success$.next(succ);
    this.name = n;
    this.succes_is_visible$.next(true);
  }

  // setVisible(v: boolean): void{
  //   this.succes_is_visible$.next(v);
  // }

  removeSuccess(){
    this.is_success$.next(0);
    this.succes_is_visible$.next(false);
  }
}

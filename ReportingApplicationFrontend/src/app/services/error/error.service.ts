import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  // 0 - wartość domyślna
  // -1 - Wystąpił nieoczekiwany błąd lub sesja użytkownika wygasła! Proszę zalogować się ponownie. (authorization.guard.ts)
  // -2 - Logowanie nie powiodło się, spróbuj ponownie! (login.componen.ts)
  // -3 - Wystąpił problem podczas dodawania użytkownika. (modal.component.ts)
  // -4 - Wystąpił problem podczas usuwania użytkownika. (modal.component.ts)
  // -5 - Wystąpił problem podczas aktualizacji użytkownika. (modal.component.ts)
  // -6 - Wystąpił problem podczas blokowania/odblokowywania użytkownika. (modal.component.ts)
  // -7 - Wystąpił problem podczas zmiany hasła użytkownika. (modal.component.ts)
  // -8 - Wystąpił problem podczas tworzenia zgłoszenia! (modal.component.ts)

  private is_error: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private error_is_visible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private name: string | null = "";
  
  constructor() {}

  getError(): Observable<number>{
    return this.is_error.asObservable();
  }
  
  getVisible(): Observable<boolean>{
    return this.error_is_visible.asObservable();
  }

  getName(): string | null{
    return this.name;
  }

  setError(err: number, n: string | null): void{
    this.is_error.next(err);
    this.name = n ?? "Nie zdefiniowano";
    this.error_is_visible.next(true);
  }

  // setVisible(v: boolean): void{
  //   this.error_is_visible.next(v);
  // }
  
  removeError(): void{
    this.is_error.next(0);
    this.error_is_visible.next(false);
  }
}

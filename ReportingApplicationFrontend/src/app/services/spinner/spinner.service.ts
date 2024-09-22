import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  loading(): BehaviorSubject<boolean>{
    this.isLoading$.next(true);
    return this.isLoading$;
  }

  setLoading(x: boolean): void{
    this.isLoading$.next(x);
  }
}

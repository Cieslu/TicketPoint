import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SuccessService } from '../../services/success/success.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnChanges{
  formUser: User = new User("", "", "", "", "", "", "", "", false, false, "#000000");
  @Input() userToEdit!: User;
  @Input() operation: number = 0;
  @Output() formEvent = new EventEmitter<User>;

  constructor(
    private successService: SuccessService
  ){}

  ngOnChanges(changes: SimpleChanges): void { //Metoda ta służy do zmiany danych użytkownika w formularzu edycji, poprzez zmianę stanu dekoratora "userToEdit"
    if(changes['userToEdit']){
      this.formUser = this.userToEdit;
    }
  }

  execForm(form: NgForm) {
    if (this.operation === 4) {
      if(this.formUser.isAdministrator === false){//Gdy uzytkownik nie jest adminem, właściość "adminColor" jest ustawiana na null
        this.formUser.adminColor = null;
      }
      this.formEvent.emit(this.formUser);
      this.successService.getSuccess().subscribe(x => { //Gdy pomyślnie doda się użytkownika, formularz czyści się
        if (x === 3) {
          form.resetForm();//Nie może być sam resetForm() gdyż zmienia bool na null
          this.formUser.id = ""; 
          this.formUser.firstName = ""; 
          this.formUser.lastName = ""; 
          this.formUser.userName = ""; 
          this.formUser.email = ""; 
          this.formUser.password = ""; 
          this.formUser.branch = ""; 
          this.formUser.signature = ""; 
          this.formUser.isAdministrator = false; 
          this.formUser.locked = false; 
        }
      });
    } else if (this.operation === 1) {
      this.formEvent.emit(this.formUser);
    }
  }
}

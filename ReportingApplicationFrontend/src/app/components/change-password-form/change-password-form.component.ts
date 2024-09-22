import { AfterContentChecked, AfterViewChecked, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChangePassword } from '../../models/changePassword';
import { FormsModule, NgForm } from '@angular/forms';
import { SuccessService } from '../../services/success/success.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-change-password-form',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.css'
})
export class ChangePasswordFormComponent implements OnChanges{
  @Output() formEvent = new EventEmitter();
  @Input() userId!: string;
  changePassword: ChangePassword = new ChangePassword("", "", "");
  comparePassw: boolean = false;
  dupa!: NgForm;

  constructor(
    private successService: SuccessService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {//Jest to zrobione po to, aby po wyjściu z okna do zmiany hasła formularz się zresetował
    if(changes['userId']){
      this.changePassword.userId = "";
      this.changePassword.password1 = "";
      this.changePassword.password2 = "";
      this.comparePassword();
    }
  }

  execForm(form: NgForm) {
    if(!this.comparePassw && this.changePassword.password1 !== "" && this.changePassword.password2 !== ""){
      this.changePassword.userId = this.userId;
      this.formEvent.emit(this.changePassword);
      this.successService.getSuccess().subscribe(x => { //Gdy pomyślnie zmieni się hasło, formularz czyści się
        form.resetForm();
        this.changePassword.userId = "";
        this.changePassword.password1 = "";
        this.changePassword.password2 = "";
      });
    }else{
      this.comparePassw = true;
    }
  }

  comparePassword(){
    this.comparePassw = this.changePassword.password1 !== this.changePassword.password2 ? true : false;//Porównanie haseł, gdy są takie same jest "false", natomiast gdy są różne jest "true"
  }
}

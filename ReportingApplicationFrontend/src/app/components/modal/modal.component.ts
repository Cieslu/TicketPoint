import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { NgClass } from '@angular/common';
import { FormComponent } from '../form/form.component';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SuccessService } from '../../services/success/success.service';
import { ErrorService } from '../../services/error/error.service';
import { UserDTO } from '../../modelsDTO/userDTO';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { LogoutService } from '../../services/logout/logout.service';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { ChangePassword } from '../../models/changePassword';
import { TicketManagementService } from '../../services/ticketManagement/ticketManagement.service';
import { Ticket } from '../../models/ticket';
import { map, tap } from 'rxjs';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass, FormComponent, SpinnerComponent, TicketFormComponent, ChangePasswordFormComponent, ErrorComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnChanges {

  @Input() operation: number = 0;
  @Input() user: User | null = new User("", "", "", "", "", "", "", "", false, false);
  @Output() newUser = new EventEmitter();
  @Output() removeUser = new EventEmitter();
  @Output() updateUser = new EventEmitter();
  @Output() lockUser = new EventEmitter();
  isLoading: boolean = false;
  @ViewChild('btnClose') button!: ElementRef;//Wyłapanie przycisku do zamykania okna modalnego
  name!: string;
  canDeleteUser: boolean = false;

  constructor(
    private userManagementService: UserManagementService,
    private spinnerService: SpinnerService,
    private successService: SuccessService,
    private errorService: ErrorService,
    private logoutService: LogoutService,
    private ticketManagementService: TicketManagementService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.name = `${this.user?.firstName} ${this.user?.lastName}`;

      if (this.operation === 3) {//Gdy chcemy usunąć uzytkownika, sprawdzane jest, czy dany użytkonik posiada jakiekolwiek zgłoszenia, jeśli tak, to nie wyskoczy komunkat, że nie można go usunąć
        this.ticketManagementService.doesUserhaveAnyTickets(this.user!.id).subscribe(x => this.canDeleteUser = x);
      }
    }
  }

  addUser(formUser: User): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);
    const name = `${formUser.firstName} ${formUser.lastName}`;
    this.userManagementService.addUser(formUser).subscribe({
      next: (user: UserDTO) => {
        this.newUser.emit(user); //To jest po to aby aktualizować listę użytkowników po ich dodaniu
        this.spinnerService.setLoading(false);
        this.button.nativeElement.click();
        this.successService.setSuccess(3, name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.button.nativeElement.click();
          this.logoutService.logoutErr401();
        } else {
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.errorService.setError(-3, name);
        }
      }
    });
  }

  editUser(formUser: User): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);
    const name = `${formUser.firstName} ${formUser.lastName}`;
    this.userManagementService.editUser(formUser).subscribe({
      next: () => {
        this.updateUser.emit(formUser); //To jest po to aby zaktualizować listę użytkowników po aktualziacji któregoś z nich
        this.spinnerService.setLoading(false);
        this.button.nativeElement.click();
        this.successService.setSuccess(5, name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.button.nativeElement.click();
          this.logoutService.logoutErr401();
        } else {
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.errorService.setError(-5, name);
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (!this.canDeleteUser) {
      const name = `${user.firstName} ${user.lastName}`;
      this.spinnerService.loading().subscribe(x => this.isLoading = x);
      this.userManagementService.deleteUser(user).subscribe({
        next: () => {
          this.removeUser.emit(user);
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.successService.setSuccess(4, name);
        },
        error: (err) => {
          if (err.status === 401) {
            this.button.nativeElement.click();
            this.logoutService.logoutErr401();
          } else {
            this.spinnerService.setLoading(false);
            this.button.nativeElement.click();
            this.errorService.setError(-4, name);
          }
        }
      });
    }
  }

  lockOrUnlockUser(user: User): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);
    const name = `${user.firstName} ${user.lastName}`;
    this.userManagementService.lockOrUnlockUser(user).subscribe({
      next: () => {
        this.lockUser.emit(user);
        this.spinnerService.setLoading(false);
        this.button.nativeElement.click();
        this.successService.setSuccess(user.locked ? 7 : 6, name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.button.nativeElement.click();
          this.logoutService.logoutErr401();
        } else {
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.errorService.setError(-6, name);
        }
      }
    });
  }

  editPassword(changePassword: ChangePassword): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);
    const name = `${this.user!.firstName} ${this.user!.lastName}`;
    this.userManagementService.editPassword(changePassword).subscribe({
      next: () => {
        this.spinnerService.setLoading(false);
        this.button.nativeElement.click();
        this.successService.setSuccess(8, name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.button.nativeElement.click();
          this.logoutService.logoutErr401();
        } else {
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.errorService.setError(-7, name);
        }
      }
    });
  }

  addTicket(ticket: Ticket): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);
    this.ticketManagementService.addTicket(ticket).subscribe({
      next: () => {
        console.log("Udało się!");
        this.spinnerService.setLoading(false);
        this.button.nativeElement.click();
        this.successService.setSuccess(9, ticket.title);
      },
      error: (err) => {
        console.log("Nie udało się!");
        if (err.status === 401) {
          this.button.nativeElement.click();
          this.logoutService.logoutErr401();
        } else {
          this.spinnerService.setLoading(false);
          this.button.nativeElement.click();
          this.errorService.setError(-8, ticket.title);
        }
      }
    });
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Ticket } from '../../models/ticket';
import { NgClass } from '@angular/common';
import { SuccessService } from '../../services/success/success.service';
import { TicketManagementService } from '../../services/ticketManagement/ticketManagement.service';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { UserDTO } from '../../modelsDTO/userDTO';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, SpinnerComponent, NgClass],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent {
  @Output() formEvent = new EventEmitter<Ticket>;
  ticket: Ticket = new Ticket("", "", "", "", "", false, "", new UserDTO("", "", "" , "", "", "", "", "", false, false));
  recipient: string = "Dział IT i Wdrożeń";
  isLoading: boolean = false;

  constructor(
    private successService: SuccessService,
    private ticketManagementService: TicketManagementService,
    private isLoggedService: IsLoggedService
  ){}

  execForm(ticketForm: NgForm) {
    this.ticket.userId = this.isLoggedService.takeIdFromToken();
    this.formEvent.emit(this.ticket);
    this.successService.getSuccess().subscribe(x => { //Gdy pomyślnie doda się zgłoszenie, formularz czyści się
      if (x === 9) {
        ticketForm.resetForm();
        this.ticket.id = "";
        this.ticket.userId = "";
        this.ticket.title = "";
        this.ticket.description = "";
      }
    });
  }

  uploadFiles(event: any){//Metoda ta służy do dodawania załączników do pola "files" w obiekcie typu "Ticket"
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.ticket.files = inputElement.files;
    }
  }
}

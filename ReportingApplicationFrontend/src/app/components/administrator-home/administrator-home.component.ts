import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SearchComponent } from '../search/search.component';
import { SuccessComponent } from '../success/success.component';
import { ModalComponent } from '../modal/modal.component';
import { ErrorComponent } from '../error/error.component';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { TicketManagementService } from '../../services/ticketManagement/ticketManagement.service';
import { TicketDTO } from '../../modelsDTO/ticketDTO';
import { Ticket } from '../../models/ticket';
import { RouterLink } from '@angular/router';
import { TicketComponent } from '../ticket/ticket.component';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { LogoutService } from '../../services/logout/logout.service';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { Recipent } from '../../models/recipent';
import { DecodeTokenService } from '../../services/decode_token/decode-token.service';
import { AsidePanelComponent } from '../aside-panel/aside-panel.component';
import { ErrorService } from '../../services/error/error.service';
import { SuccessService } from '../../services/success/success.service';

@Component({
  selector: 'app-administrator-home',
  standalone: true,
  imports: [SpinnerComponent, ModalComponent, SuccessComponent, ErrorComponent, SearchComponent, RouterLink, TicketComponent, NgClass, SearchComponent, CommonModule, AsidePanelComponent],
  templateUrl: './administrator-home.component.html',
  styleUrl: './administrator-home.component.css'
})
export class AdministratorHomeComponent implements OnInit, OnDestroy {
  private subscriptionSpinner: Subscription = new Subscription();
  private subscriptionShowTicket: Subscription = new Subscription();

  tickets: Ticket[] = [];
  searchedTickets: Ticket[] = [];

  openTickets: Ticket[] = [];
  searchedOpenTickets: Ticket[] = [];

  closedTickets: Ticket[] = [];
  searchedClosedTickets: Ticket[] = [];

  branches: Set<string> = new Set<string>();
  updatedBranches: boolean = false;
  isLoading: boolean = false;
  action: number = 0;
  placeholder: string = "Wyszukaj zgłoszenie";
  isRecipent: boolean = false;
  userId!: string;
  error_is_visible: boolean = false;
  success_is_visible: boolean = false;
  accessibleCheckBox: boolean = true;
  checkBoxClosedTickets: boolean = false;
  checkBoxOnlyMine: boolean = false;
  wasDownloaded: boolean = false;

  constructor(
    private ticketManagementService: TicketManagementService,
    private spinnerService: SpinnerService,
    private logoutService: LogoutService,
    private isLoggedService: IsLoggedService,
    private decodeTokenService: DecodeTokenService,
    private errorService: ErrorService,
    private successService: SuccessService
  ) { }

  ngOnInit(): void {
    this.subscriptionSpinner = this.spinnerService.loading().subscribe(x => this.isLoading = x);
    this.userId = this.decodeTokenService.getIdFromToken()!;

    this.subscriptionShowTicket = this.ticketManagementService.showTickets(false).subscribe({
      next: (res: TicketDTO[]) => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();
        res.forEach(u => {
          const date: string[] = u.created.split(" ");//Formatowanie daty na rozpoznawalną przez potok "date"
          const formattedDate: string = date[0].split('.').reverse().join('-') + 'T' + date[1];//Formatowanie daty na rozpoznawalną przez potok "date"
          u.created = formattedDate;
          this.openTickets.push(this.ticketManagementService.toTicket(u))
          this.openTickets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        });
        this.searchedOpenTickets = JSON.parse(JSON.stringify(this.openTickets));
        this.openTickets.forEach(x => { this.branches.add(x.user!.signature) });//W tym przypadku sa robione kopie wartości

        this.tickets = this.openTickets;
        this.searchedTickets = this.searchedOpenTickets;
      },
      error: err => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();
      }
    });
    

    

    // this.errorService.getVisible().subscribe({
    //   next: (x: boolean) => { this.error_is_visible = x }
    // });

    // this.successService.getVisible().subscribe({
    //   next: (x: boolean) => { this.success_is_visible = x }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptionShowTicket.unsubscribe();
  }

  isRead(ticketId: string): void {
    this.ticketManagementService.isRead(ticketId).subscribe({
      next: () => {
        const ticket = this.tickets.find(x => x.id === ticketId);
        const searchedTicket = this.searchedTickets.find(x => x.id === ticketId);
        if (ticket !== undefined && searchedTicket !== undefined) {
          ticket.isRead = ticket.isRead ? false : true;
          searchedTicket.isRead = searchedTicket.isRead ? false : true;
        }
      },
      error: () => {
        this.logoutService.logoutErr401();
      }
    });
  }

  takeTicket(ticketId: string): void {
    this.ticketManagementService.takeTicket(ticketId, this.userId!).subscribe({
      next: () => {
        const ticket = this.tickets.find(x => x.id === ticketId);
        const searchedTicket = this.searchedTickets.find(x => x.id === ticketId);
        if (ticket !== undefined && searchedTicket !== undefined) {
          if (ticket.recipents?.length !== 0) {
            const recipent = ticket.recipents!.find(r => r.userId === this.userId);
            if (recipent === undefined) {//Gdy nie ma odbiorcy, jest on dodawany do listy odbiorców danego tikcetu
              ticket.recipents?.push(new Recipent(this.userId, this.decodeTokenService.getUserNameFromToken(), this.decodeTokenService.getColorFromToken()));
            } else {
              const indexFromRecipents = ticket.recipents!.findIndex(r => r.userId === this.userId);
              ticket.recipents!.splice(indexFromRecipents, 1);
            }
          } else {
            ticket.recipents?.push(new Recipent(this.userId, this.decodeTokenService.getUserNameFromToken(), this.decodeTokenService.getColorFromToken()));
          }
        }
      },
      error: () => {
        this.logoutService.logoutErr401();
      }
    });
  }

  searchUser(searchText: string): void {
    this.tickets = JSON.parse(JSON.stringify(this.searchedTickets.filter(x => x.name!.toUpperCase().includes(searchText.toUpperCase().trim()))));//Trzeba zrobić głęboką kopię, aby nie pracować na refrencji
  }

  searchBranch(searchText: string): void {
    this.tickets = JSON.parse(JSON.stringify(this.searchedTickets.filter(x => x.user.signature.toUpperCase().includes(searchText.toUpperCase().trim()))));//Trzeba zrobić głęboką kopię, aby nie pracować na refrencji
  }

  closeOrOpenTicket(ticketId: string) {
    this.ticketManagementService.closeOrOpenTicket(ticketId).subscribe({
      next: () => {
        const ticket = this.tickets.find(x => x.id === ticketId);
        const searchedTicket = this.searchedTickets.find(x => x.id === ticketId);

        const ticketIndex = this.tickets.findIndex(x => x.id === ticketId);
        const searchedTicketIndex = this.searchedTickets.findIndex(x => x.id === ticketId);
        
        if (ticket !== undefined && searchedTicket !== undefined) {
          if(this.checkBoxClosedTickets){
            ticket.isFinished ? this.tickets.splice(ticketIndex, 1) : null;
            searchedTicket.isFinished ? this.searchedTickets.splice(searchedTicketIndex, 1) : null;
            this.openTickets.push(ticket);
            this.searchedOpenTickets.push(searchedTicket);
          }else{
            ticket.isFinished ? null : this.tickets.splice(ticketIndex, 1);
            searchedTicket.isFinished ? null : this.searchedTickets.splice(searchedTicketIndex, 1);
            this.closedTickets.push(ticket);
            this.searchedClosedTickets.push(searchedTicket);
          }
          ticket.isFinished = ticket.isFinished ? false : true;
          searchedTicket.isFinished = searchedTicket.isFinished ? false : true;        
        }
      },
      error: () => {
        this.logoutService.logoutErr401();
      }
    });
  }

  showClosedTickets(result: boolean): void {
    this.checkBoxClosedTickets = result;
    if (result) {
      if(!this.wasDownloaded){
        this.closedTickets = [];
        this.searchedClosedTickets = [];
        this.subscriptionShowTicket = this.ticketManagementService.showTickets(result).subscribe({
          next: (res: TicketDTO[]) => {
            this.wasDownloaded = true;
            this.spinnerService.setLoading(false);
            this.subscriptionSpinner.unsubscribe();
            res.forEach(u => {
              const date: string[] = u.created.split(" ");//Formatowanie daty na rozpoznawalną przez potok "date"
              const formattedDate: string = date[0].split('.').reverse().join('-') + 'T' + date[1];//Formatowanie daty na rozpoznawalną przez potok "date"
              u.created = formattedDate;
              this.closedTickets.push(this.ticketManagementService.toTicket(u))
              this.closedTickets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
            });
            this.searchedClosedTickets = JSON.parse(JSON.stringify(this.closedTickets));
            this.closedTickets.forEach(x => { this.branches.add(x.user!.signature) });//W tym przypadku sa robione kopie wartości
  
            this.tickets = this.closedTickets;
            this.searchedTickets = this.searchedClosedTickets
          },
          error: err => {
            this.spinnerService.setLoading(false);
            this.subscriptionSpinner.unsubscribe();
            this.logoutService.logoutErr401();
          }
        });
      }else{
        this.tickets = this.closedTickets;
        this.searchedTickets = this.searchedClosedTickets;
        if(this.checkBoxOnlyMine){
          this.onlyMine(true);
        }
      }
    } else {
      this.tickets = this.openTickets;
      this.searchedTickets = this.searchedOpenTickets;
    }
  }

  onlyMine(result: boolean): void{
    this.checkBoxOnlyMine = result;
    if(result && this.checkBoxClosedTickets){
      this.tickets = this.closedTickets.filter(t => t.recipents?.some(r => r.userId === this.userId));
      this.searchedTickets = this.searchedClosedTickets.filter(t => t.recipents?.some(r => r.userId === this.userId));
    }
    else if(result && !this.checkBoxClosedTickets){
      this.tickets = this.openTickets.filter(t => t.recipents?.some(r => r.userId === this.userId));
      this.searchedTickets = this.searchedOpenTickets.filter(t => t.recipents?.some(r => r.userId === this.userId));
    }
    else if(!result && this.checkBoxClosedTickets){
      this.tickets = this.closedTickets;
      this.searchedTickets = this.searchedClosedTickets;
    }
    else if(!result && !this.checkBoxClosedTickets){
      this.tickets = this.openTickets;
      this.searchedTickets = this.searchedOpenTickets;
    }
  }
}

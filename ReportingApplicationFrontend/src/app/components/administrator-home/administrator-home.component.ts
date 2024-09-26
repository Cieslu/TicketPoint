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
import { Subscription } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { LogoutService } from '../../services/logout/logout.service';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { Recipent } from '../../models/recipent';

@Component({
  selector: 'app-administrator-home',
  standalone: true,
  imports: [SpinnerComponent, ModalComponent, SuccessComponent, ErrorComponent, SearchComponent, RouterLink, TicketComponent, NgClass, SearchComponent, CommonModule],
  templateUrl: './administrator-home.component.html',
  styleUrl: './administrator-home.component.css'
})
export class AdministratorHomeComponent implements OnInit, OnDestroy {
  private subscriptionSpinner: Subscription = new Subscription();
  private subscriptionShowTicket: Subscription = new Subscription();
  tickets: Ticket[] = [];
  searchedTickets: Ticket[] = [];
  branches: Set<string> = new Set<string>();
  updatedBranches: boolean = false;
  isLoading: boolean = false;
  action: number = 0;
  placeholder: string = "Wyszukaj zgłoszenie";

  constructor(
    private ticketManagementService: TicketManagementService,
    private spinnerService: SpinnerService,
    private logoutService: LogoutService,
    private isLoggedService: IsLoggedService
  ) { }

  ngOnInit(): void {
    this.subscriptionSpinner = this.spinnerService.loading().subscribe(x => this.isLoading = x);

    this.subscriptionShowTicket = this.ticketManagementService.showTickets().subscribe({
      next: (res: TicketDTO[]) => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();
        res.forEach(u => {
          const date: string[] = u.created.split(" ");//Formatowanie daty na rozpoznawalną przez potok "date"
          const formattedDate: string = date[0].split('.').reverse().join('-') + 'T' + date[1];//Formatowanie daty na rozpoznawalną przez potok "date"
          u.created = formattedDate;
          this.tickets.push(this.ticketManagementService.toTicket(u))
          this.tickets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        });
        this.searchedTickets = JSON.parse(JSON.stringify(this.tickets));
        this.tickets.forEach(x => {this.branches.add(x.user!.signature), console.log(x.recipent)});//W tym przypadku sa robione kopie wartości
      },
      error: err => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionShowTicket.unsubscribe();
  }

  isRead(ticketId: string): void {
    this.ticketManagementService.isRead(ticketId).subscribe({
      next: () => {
        const indexFromTickets = this.tickets.findIndex(x => x.id === ticketId);
        const indexFromSearchedTickets = this.searchedTickets.findIndex(x => x.id === ticketId);
        if (indexFromTickets !== -1 && indexFromSearchedTickets !== -1) {
          const checkedTicket = this.tickets[indexFromTickets];
          const checkedSearchedTicket = this.searchedTickets[indexFromSearchedTickets];
          checkedTicket.isRead = checkedTicket.isRead ? false : true;
          checkedSearchedTicket.isRead = checkedSearchedTicket.isRead ? false : true;
        }
      },
      error: () => {
        this.logoutService.logoutErr401();
      }
    });
  }
  
  takeTicket(ticketId: string): void {
    this.ticketManagementService.takeTicket(ticketId, this.isLoggedService.takeIdFromToken()).subscribe({
      next: () => {
        const ticket = this.tickets.find(x => x.id === ticketId);
        const searchedTicket = this.searchedTickets.find(x => x.id === ticketId);
        if (ticket !== undefined && searchedTicket !== undefined) {
          console.log(ticket.recipent)
          if(ticket.recipent?.recipentName !== null && ticket.recipent?.recipentName !== undefined){
            console.log("rozny")
            ticket.recipent!.id = null; 
            ticket.recipent!.userId = null; 
            ticket.recipent!.recipentName = null; 
          }else{
            console.log("nie rozny " + this.isLoggedService.takeUserNameFromToken())
            ticket.recipent!.recipentName = this.isLoggedService.takeUserNameFromToken();
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
}

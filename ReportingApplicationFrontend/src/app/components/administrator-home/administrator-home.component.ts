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
import { DecodeTokenService } from '../../services/decode_token/decode-token.service';

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
  isRecipent: boolean = false;
  userId!: string;

  constructor(
    private ticketManagementService: TicketManagementService,
    private spinnerService: SpinnerService,
    private logoutService: LogoutService,
    private isLoggedService: IsLoggedService,
    private decodeTokenService: DecodeTokenService
  ) { }

  ngOnInit(): void {
    this.subscriptionSpinner = this.spinnerService.loading().subscribe(x => this.isLoading = x);
    this.userId = this.decodeTokenService.getIdFromToken()!;


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
        this.tickets.forEach(x => {this.branches.add(x.user!.signature)});//W tym przypadku sa robione kopie wartości
        // this.checkRecipentIdInTicket();
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
          if(ticket.recipents?.length !== 0){
            const recipent = ticket.recipents!.find(r => r.userId === this.userId);
            if (recipent === undefined) {//Gdy nie ma odbiorcy, jest on dodawany do listy odbiorców danego tikcetu
              ticket.recipents?.push(new Recipent(this.userId, this.decodeTokenService.getUserNameFromToken(), this.decodeTokenService.getColorFromToken()));
              // this.setIsRecipentInLocalStorage("true");
              // this.getIsRecipentFromLocalStorage();
            }else{
                const indexFromRecipents = ticket.recipents!.findIndex(r => r.userId === this.userId);
                ticket.recipents!.splice(indexFromRecipents, 1);
                // this.setIsRecipentInLocalStorage("false");
                // this.getIsRecipentFromLocalStorage();
            }         
          }else{
            ticket.recipents?.push(new Recipent(this.userId, this.decodeTokenService.getUserNameFromToken(), this.decodeTokenService.getColorFromToken()));
            // this.setIsRecipentInLocalStorage("true");
            // this.getIsRecipentFromLocalStorage();
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

  closeOrOpenTicket(ticketId: string){
    this.ticketManagementService.closeOrOpenTicket(ticketId).subscribe({
      next: () => {
        const ticket = this.tickets.find(x => x.id === ticketId);
        const searchedTicket = this.searchedTickets.find(x => x.id === ticketId);
        if (ticket !== undefined && searchedTicket !== undefined) {
          ticket.isFinished = ticket.isFinished ? false : true;
          searchedTicket.isFinished = searchedTicket.isFinished ? false : true;
        }
      },
      error: () => {
        this.logoutService.logoutErr401();
      }
    });
  }

  // checkRecipentIdInTicket(){
  //   const userId = this.decodeTokenService.getIdFromToken();
  //   let ticketHasRecipent = false;
  //   let ticketHasRecipentSearched = false;

  //   this.tickets.map(t => t.recipents?.map(r => {
  //     if(r.userId === userId){
  //       ticketHasRecipent = true;
  //     }
  //   }));

  //   this.searchedTickets.map(st => st.recipents?.map(r => {
  //     if(r.userId === userId){
  //       ticketHasRecipentSearched = true;
  //     }
  //   }));

  //   if(ticketHasRecipent && ticketHasRecipentSearched){
  //     localStorage.setItem("isRecipent", "true");
  //     this.getIsRecipentFromLocalStorage();
  //   }
  // }

  // getIsRecipentFromLocalStorage(){//Funkcja sprawdza czy zalogowany admin przyjął dany ticket, czy nie, jeśli tak na zgłoszeniu pojawi się jego userName (isRecipent jest odczytywany z localStorage)
  //   this.isRecipent = localStorage.getItem("isRecipent") === "true";
  // }

  // setIsRecipentInLocalStorage(isRecipent: string){
  //   localStorage.setItem("isRecipent", isRecipent);
  // }
}

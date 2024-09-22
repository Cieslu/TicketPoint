import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket';
import { TicketManagementService } from '../../services/ticketManagement/ticketManagement.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TicketDTO } from '../../modelsDTO/ticketDTO';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Attachment } from '../../models/attachment';
import { saveAs } from 'file-saver';
import { TagContentType } from '@angular/compiler';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [SpinnerComponent, CommonModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit, OnDestroy {
  private subscriptionTicket: Subscription = new Subscription();
  private subscriptionSpinner: Subscription = new Subscription();
  private subscriptionAttachment: Subscription = new Subscription();
  ticket!: Ticket;
  isLoading: boolean = false;

  constructor(
    private ticketManagementService: TicketManagementService,
    private spinnerService: SpinnerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscriptionTicket = this.spinnerService.loading().subscribe(x => this.isLoading = x);
    const ticketId = this.route.snapshot.paramMap.get('ticketId');
    this.subscriptionTicket = this.ticketManagementService.showTicket(ticketId!).subscribe({
      next: (res: TicketDTO) => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();//Odsubskrybowanie spinnera
        const date: string[] = res.created.split(" ");//Formatowanie daty na rozpoznawalną przez potok "date"
        const formattedDate: string = date[0].split('.').reverse().join('-') + 'T' + date[1];//Formatowanie daty na rozpoznawalną przez potok "date"
        res.created = formattedDate;
        this.ticket = this.ticketManagementService.toTicket(res);
      },
      error: err => {
        this.spinnerService.setLoading(false);
        this.subscriptionSpinner.unsubscribe();//Odsubskrybowanie spinnera
      }
    });

  }

  ngOnDestroy(): void {
    console.log("xszdfdsgsdf")
    this.subscriptionTicket.unsubscribe();//Odsubskrybowanie ticketu
  }

  downloadAttachment(attachment: Attachment): void {
    this.subscriptionAttachment = this.ticketManagementService.downloadAttachment(attachment).subscribe((attach: HttpResponse<Blob>) => {
      const header = attach.headers.get('Content-Disposition');
      const matches = header!.split(';').map(v => v.trim());
      const fileName = matches.find(v => v.startsWith('filename='))!.substring(9).replace(/"/g, '');
      saveAs(attach.body!, fileName)
      this.subscriptionAttachment.unsubscribe();
    })
  };
}

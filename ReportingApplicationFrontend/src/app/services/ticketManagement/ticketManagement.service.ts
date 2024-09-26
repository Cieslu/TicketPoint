import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDTO } from '../../modelsDTO/ticketDTO';
import { Ticket } from '../../models/ticket';
import { UserManagementService } from '../userManagement/userManagement.service';
import { Attachment } from '../../models/attachment';
import { AttachmentDTO } from '../../modelsDTO/attachmentDTO';
import { RecipentDTO } from '../../modelsDTO/recipentDTO';
import { Recipent } from '../../models/recipent';

@Injectable({
  providedIn: 'root'
})
export class TicketManagementService {
  api: string = "https://localhost:44385/api/TicketManagement"; //Dom

  constructor(
    private httpClient: HttpClient,
    private userManagementService: UserManagementService
  ) { }

  addTicket(ticket: Ticket): Observable<TicketDTO>{
    const ticketDTO: TicketDTO = this.toTicketDTO(ticket);
    const formData: FormData = new FormData();
    //formData.append("ticketId", ticketDTO.ticketId);
    formData.append("userId", ticketDTO.userId);
    //formData.append("created", ticketDTO.created);
    formData.append("title", ticketDTO.title);
    formData.append("description", ticketDTO.description);
    if(ticketDTO.files !== undefined){
      Array.from(ticketDTO.files!).forEach(f => {
        formData.append("files", f);
      });
    }
    //formData.append("filesPaths", "");
    return this.httpClient.post<TicketDTO>(`${this.api}/addTicket`, formData);
  }

  showTickets(): Observable<TicketDTO[]>{
    return this.httpClient.get<TicketDTO[]>(`${this.api}/showTickets`);
  }

  showTicket(ticketId: string): Observable<TicketDTO>{
    return this.httpClient.get<TicketDTO>(`${this.api}/showTicket/${ticketId}`);
  }

  doesUserhaveAnyTickets(userId: string): Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.api}/doesUserHaveAnyTickets/${userId}`);
  }

  downloadAttachment(attachment: Attachment){
    return this.httpClient.get(`${this.api}/downloadAttachment/${attachment.ticketId}/${attachment.id}`, {observe: 'response', responseType: 'blob'});
  }

  isRead(ticketId: string): Observable<HttpStatusCode>{
    return this.httpClient.put<HttpStatusCode>(`${this.api}/isRead/${ticketId}`, null);
  }

  takeTicket(ticketId: string, userId: string): Observable<HttpStatusCode>{
    console.log(userId);
    return this.httpClient.put<HttpStatusCode>(`${this.api}/takeTicket/${ticketId}/${userId}`, null);
  }




  toTicketDTO(ticket: Ticket): TicketDTO{
    return new TicketDTO(
      ticket.id, 
      ticket.userId, 
      ticket.created, 
      ticket.title, 
      ticket.description, 
      ticket.isRead, 
      ticket.status, 
      ticket.files, 
      (ticket.user ? this.userManagementService.toUserDTO(ticket.user!) : undefined), 
      ticket.attachments?.map(x => this.toAttachmentDTO(x)),
      this.toRecipentDTO(ticket.recipent)
    );
  }

  toTicket(ticketDTO: TicketDTO): Ticket{
    return new Ticket(
      ticketDTO.id, 
      ticketDTO.userId, 
      ticketDTO.created, 
      ticketDTO.title, 
      ticketDTO.description, 
      ticketDTO.isRead, 
      ticketDTO.status, 
      this.userManagementService.toUser(ticketDTO.user!), 
      ticketDTO.attachments?.map(x => this.toAttachment(x)),
      ticketDTO.files, 
      this.toRecipent(ticketDTO.recipent)
    );
  }

  toAttachmentDTO(attachment: Attachment): AttachmentDTO{
    return new AttachmentDTO(attachment.id, attachment.fileName, attachment.filePath, attachment.ticketId);
  }

  toAttachment(attachmentDTO: AttachmentDTO): Attachment{
    return new Attachment(attachmentDTO.id, attachmentDTO.fileName, attachmentDTO.filePath, attachmentDTO.ticketId);
  }

  toRecipentDTO(recipent?: Recipent | null): RecipentDTO{
    return new RecipentDTO(recipent?.id, recipent?.userId, recipent?.recipentName);
  }

  toRecipent(recipentDTO?: RecipentDTO): Recipent{
    return new Recipent(recipentDTO?.id, recipentDTO?.userId, recipentDTO?.recipentName);
  }
}

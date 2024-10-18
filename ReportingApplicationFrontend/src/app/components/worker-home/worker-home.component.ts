import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '../error/error.component';
import { IsLoggedService } from '../../services/is_logged/is-logged.service';
import { RoleService } from '../../services/role/role.service';
import { TicketFormComponent } from "../ticket-form/ticket-form.component";
import { ModalComponent } from '../modal/modal.component';
import { DecodeTokenService } from '../../services/decode_token/decode-token.service';
import { ErrorService } from '../../services/error/error.service';
import { SuccessService } from '../../services/success/success.service';
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: 'app-worker-home',
  standalone: true,
  imports: [RouterLink, ErrorComponent, TicketFormComponent, ModalComponent, SuccessComponent, ErrorComponent],
  templateUrl: './worker-home.component.html',
  styleUrl: './worker-home.component.css'
})
export class WorkerHomeComponent implements OnInit {
  role$: boolean = false;
  userName: string = "";
  action: number = 0;
  error_is_visible: boolean = false;
  success_is_visible: boolean = false;

  constructor(
    private roleService: RoleService,
    private isLoggedService: IsLoggedService,
    private decodeTokenService: DecodeTokenService,
    private errorService: ErrorService,
    private successService: SuccessService
  ) {}

  ngOnInit(): void {
    // this.roleService.getRole().subscribe({//Sprawdzanie czy użytkownik ma role "Administrator"
    //   next: (res: boolean) => {
    //     this.role$ = res;
    //   } 
    // });
    this.userName = this.decodeTokenService.getNameFromToken()!;

    this.errorService.getVisible().subscribe({
      next: (x: boolean) => { this.error_is_visible = x }
    });

    this.successService.getVisible().subscribe({
      next: (x: boolean) => { this.success_is_visible = x }
    });
  }

  chooseOpeartion(o: number): void{
    this.action = o;
  }
}

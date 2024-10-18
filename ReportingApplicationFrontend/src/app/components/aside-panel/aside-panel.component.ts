import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { Ticket } from '../../models/ticket';
import { User } from '../../models/user';

@Component({
  selector: 'app-aside-panel',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './aside-panel.component.html',
  styleUrl: './aside-panel.component.css'
})
export class AsidePanelComponent {
  @Input() searchedTickets!: Ticket[];
  @Input() branches!: Set<string>;
  @Input() updatedBranches!: boolean;
  @Input() placeholder!: string;
  @Input() accessibleAddUserBtn!: boolean;
  @Input() accessibleCheckBox!: boolean;
  @Output() searchUser = new EventEmitter();
  @Output() searchBranch = new EventEmitter();
  @Output() operation = new EventEmitter<{ o: number, u: User | null }>();
  @Output() checkBoxClosedTickets = new EventEmitter();
  @Output() checkBoxOnlyMine = new EventEmitter();

  passSearchUser(result: string): void {
    this.searchUser.emit(result);
  }

  passSearchBranch(result: string): void {
    this.searchBranch.emit(result);
  }

  chooseOperation(o: number, u: User | null): void {
    this.operation.emit({ o, u })
  }

  closedTickets(result: boolean): void {
    this.checkBoxClosedTickets.emit(result);
  }

  onlyMine(result: boolean): void{
    this.checkBoxOnlyMine.emit(result);
  }
}

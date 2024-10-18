import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnChanges{
  @Output() searchUser = new EventEmitter();
  @Output() searchBranch = new EventEmitter();
  @Output() checkBoxClosedTickets = new EventEmitter();
  @Output() checkBoxOnlyMine = new EventEmitter();
  @Input() branches!: Set<string>; 
  @Input() updatedBranches!: boolean;
  @Input() placeholder!: string;
  @Input() accessibleCheckBox!: boolean;

  //@Input() resetSearchB: boolean = false; 
  
  searchText: string = "";
  searchText2: string = "Filtruj po sygnaturze oddziału...";
  initialValue: string = "Filtruj po sygnaturze oddziału..."; 

  showClosedTickets: boolean = false;
  showOnlyMine: boolean = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['updatedBranches']){
      this.searchText2 = "Brak";
      this.searchText = "";
      this.searchB();
      this.search();
    }
  }
  
  search(): void{
    if(this.searchText2 !== this.initialValue){//Jeśli podczas filtracji po użytkowniku jest ustawiona filtracja po sygnaturze oddziału, to jest ona resetowana
      this.searchText2 = "Brak";
      this.searchB();
    }
    this.searchUser.emit(this.searchText);
  }

  searchB(): void{
    if(this.searchText !== ""){//Jeśli podczas filtracji po sygnaturze oddziału jest coś w polu wyszukiwania użytkownika, to ustawiany jest na pusty string 
      this.searchText = "";
    }
    else if(this.searchText2 === "Brak"){
      this.searchText2 = this.initialValue;
      this.searchBranch.emit("");
    }
    else{
      this.searchBranch.emit(this.searchText2);
    }
  }

  closedTickets(): void{
    this.checkBoxClosedTickets.emit(this.showClosedTickets)
  }

  onlyMine(): void{
    if(this.searchText2 !== this.initialValue){//Jeśli podczas filtracji po użytkowniku jest ustawiona filtracja po sygnaturze oddziału, to jest ona resetowana
      this.searchText2 = "Brak";
      this.searchB();
    }
    this.checkBoxOnlyMine.emit(this.showOnlyMine);
  }
}

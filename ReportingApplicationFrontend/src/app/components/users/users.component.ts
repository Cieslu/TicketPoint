import { Component, Input } from '@angular/core';
import { UserManagementService } from '../../services/userManagement/userManagement.service';
import { User } from '../../models/user';
import { UserDTO } from '../../modelsDTO/userDTO';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ModalComponent } from '../modal/modal.component';
import { SuccessComponent } from '../success/success.component';
import { ErrorComponent } from '../error/error.component';
import { SearchComponent } from '../search/search.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SpinnerComponent, ModalComponent, SuccessComponent, ErrorComponent, SearchComponent, NgStyle],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: User[] = [];
  searchedUsers: User[] = [];
  branches: Set<string> = new Set<string>();
  isLoading: boolean = false;
  action: number = 0;
  user: User | null = new User("", "", "", "", "", "", "", "", false, false);
  updatedBranches: boolean = false;
  placeholder: string = "Wyszukaj użytkownika"

  constructor(
    private userManagementService: UserManagementService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.loading().subscribe(x => this.isLoading = x);

    this.userManagementService.showUsers().subscribe({
      next: (res: UserDTO[]) => {
        res.forEach(u => this.users.push(this.userManagementService.toUser(u)));
        this.searchedUsers = JSON.parse(JSON.stringify(this.users));
        this.users.forEach(x => this.branches.add(x.signature));//W tym przypadku sa robione kopie wartości
        this.users.sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl', { sensitivity: 'base' }));
        this.searchedUsers.sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl', { sensitivity: 'base' }));
        this.spinnerService.setLoading(false);
      },
      error: err => {
        this.spinnerService.setLoading(false);
      }
    });
  }

  chooseOpeartion(o: number, u: User | null): void {
    this.action = o;
    this.user = Object.assign({}, u);//assign służy do kopiowania obiektu, który jest wykorzystywany podczas edycji (nie kopiuje obiektów zagnieżdżonych) oraz nie wymusza zgodności typów
  }

  addNewUserFromModal(u: User): void {
    this.users.push(this.userManagementService.toUser(u));
    this.searchedUsers.push(this.userManagementService.toUser(u));
    this.branches.add(u.signature);
    this.updatedBranches = !this.updatedBranches;//Jest to zrobione po to, aby zmienić tylko stan komponentu search.component.ts w celu jego odświeżenia
    this.users.sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl', { sensitivity: 'base' }));
    this.searchedUsers.sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl', { sensitivity: 'base' }));
  }

  deleteUser(u: User): void {
    const indexFromUsers = this.users.findIndex(x => x.id === u.id);
    const indexFromSearchedUsers = this.searchedUsers.findIndex(x => x.id === u.id);
    if (indexFromUsers !== -1) {
      const signature = this.users[indexFromUsers].signature;
      this.users.splice(indexFromUsers, 1);
      this.searchedUsers.splice(indexFromSearchedUsers, 1);
      const isSignature: User | undefined = this.users.find(x => x.signature.includes(signature));
      if (isSignature === undefined) {//Gdy nie ma użytkownika z danej sygnatury oddziału, to ta sygnatura jest usuwana z listy i nie mam jej w liście filtrującej po sygnaturze oddziału
        this.branches.delete(signature);
        this.updatedBranches = !this.updatedBranches;//Jest to zrobione po to, aby zmienić tylko stan komponentu search.component.ts w celu jego odświeżenia
      }
    }
  }

  editUser(u: User): void {
    const indexFromUsers = this.users.findIndex(x => x.id === u.id);
    const indexFromSearchedUsers = this.searchedUsers.findIndex(x => x.id === u.id);
    if (indexFromUsers !== -1 && indexFromSearchedUsers !== -1) {
      this.users[indexFromUsers] = u;
      this.searchedUsers[indexFromSearchedUsers] = u;
      this.users[indexFromUsers].name = `${u.firstName} ${u.lastName} ${u.lastName} ${u.firstName} ${u.userName} ${u.email}`;//Nie muszę edytować pola "name" także w "searchedUsers", gdyż obydwie tablice przechowują referencją do tego samego obiektu, który jest parametrem funkcji
    }
  }

  lockOrUnlockUser(u: User): void {
    const indexFromUsers = this.users.findIndex(x => x.id === u.id);
    const indexFromSearchedUsers = this.searchedUsers.findIndex(x => x.id === u.id);
    if (indexFromUsers !== -1 && indexFromSearchedUsers !== -1) {
      const lockedUser = this.users[indexFromUsers];
      const lockedSearchedUser = this.searchedUsers[indexFromSearchedUsers];
      lockedUser.locked = lockedUser.locked ? false : true;
      lockedSearchedUser.locked = lockedSearchedUser.locked ? false : true;
    }
  }

  searchUser(searchText: string): void {
    this.users = JSON.parse(JSON.stringify(this.searchedUsers.filter(x => x.name!.toUpperCase().includes(searchText.toUpperCase().trim()))));//Trzeba zrobić głęboką kopię, aby nie pracować na refrencji
  }

  searchBranch(searchText: string): void {
    this.users = JSON.parse(JSON.stringify(this.searchedUsers.filter(x => x.signature.toUpperCase().includes(searchText.toUpperCase().trim()))));//Trzeba zrobić głęboką kopię, aby nie pracować na refrencji
  }
}



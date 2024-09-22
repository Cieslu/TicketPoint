export class UserDTO{
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    branch: string;
    signature: string;
    isAdministrator: boolean;
    locked: boolean;

    constructor(_id: string, _firstName: string, _lastName: string, _userName: string, _email: string, _password: string, _branch: string, _signatue: string, _isAdministrator: boolean, _locked: boolean){
        this.id = _id ?? null;
        this.firstName = _firstName;
        this.lastName = _lastName;
        this.userName = _userName;
        this.email = _email;
        this.password = _password ?? null;
        this.branch = _branch;
        this.signature = _signatue;
        this.isAdministrator = _isAdministrator;
        this.locked = _locked;
    }
}
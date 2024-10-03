export class UserDTO{
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string | null;
    branch: string;
    signature: string;
    isAdministrator: boolean;
    locked: boolean;
    adminColor?: string | null;

    constructor(_id: string, _firstName: string, _lastName: string, _userName: string, _email: string, _password: string | null, _branch: string, _signatue: string, _isAdministrator: boolean, _locked: boolean, _adminColor?: string | null){
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
        this.adminColor =  _adminColor;
    }
}
import { AttachmentDTO } from "../modelsDTO/attachmentDTO";
import { RecipentDTO } from "../modelsDTO/recipentDTO";
import { UserDTO } from "../modelsDTO/userDTO";
import { Attachment } from "./attachment";
import { Recipent } from "./recipent";
import { User } from "./user";

export class Ticket {
    id: string;
    userId: string;
    created: string;
    title: string;
    description: string;
    isRead: boolean;
    isFinished: boolean;
    user: User;
    files?: FileList;
    attachments?: Attachment[];
    recipents?: Recipent[] | null;
    name?: string;//Wykorzystywany do wyszukiwania

    constructor(_id: string, _userId: string, _created: string, _title: string, _description: string, _isRead: boolean, _isFinished: boolean, _user: UserDTO, _attachments?: AttachmentDTO[], _files?: FileList, _recipent?: RecipentDTO[]) {
        this.id = _id;
        this.userId = _userId ?? null;
        this.created = _created;
        this.title = _title;
        this.description = _description;
        this.isRead = _isRead;
        this.isFinished = _isFinished;
        this.user = _user;
        this.attachments = _attachments;
        this.files = _files;
        this.recipents = _recipent;
        this.name = `${this.title} ${this.user.firstName} ${this.user.lastName} ${this.user.lastName} ${this.user.firstName} ${this.user.userName} ${this.user.email}`;
    }
}
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
    status: string;
    user: User;
    files?: FileList;
    attachments?: Attachment[];
    recipents?: Recipent[];
    name?: string;//Wykorzystywany do wyszukiwania

    constructor(_id: string, _userId: string, _created: string, _title: string, _description: string, _isRead: boolean, _status: string, _user: UserDTO, _files?: FileList, _attachments?: AttachmentDTO[], _recipents?: RecipentDTO[]) {
        this.id = _id;
        this.userId = _userId ?? null;
        this.created = _created;
        this.title = _title;
        this.description = _description;
        this.isRead = _isRead;
        this.status = _status;
        this.user = _user;
        this.attachments = _attachments;
        this.files = _files;
        this.recipents = _recipents;
        this.name = `${this.title} ${this.user.firstName} ${this.user.lastName} ${this.user.lastName} ${this.user.firstName} ${this.user.userName} ${this.user.email}`;
    }
}
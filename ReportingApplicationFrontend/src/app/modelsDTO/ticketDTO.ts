import { Attachment } from "../models/attachment";
import { Recipent } from "../models/recipent";
import { User } from "../models/user";
import { AttachmentDTO } from "./attachmentDTO";
import { RecipentDTO } from "./recipentDTO";
import { UserDTO } from "./userDTO";

export class TicketDTO {
    id: string;
    userId: string;
    created: string;
    title: string;
    description: string;
    isRead: boolean;
    status: string;
    files?: FileList;
    user?: UserDTO;
    attachments?: AttachmentDTO[];
    recipents?: RecipentDTO[];

    constructor(_id: string, _userId: string, _created: string, _title: string, _description: string, _isRead: boolean, _status: string, _files?: FileList, _user?: User, _attachments?: Attachment[], _recipent?: Recipent[]) {
        this.id = _id;
        this.userId = _userId;
        this.created = _created ?? null;
        this.title = _title;
        this.description = _description;
        this.isRead = _isRead;
        this.status = _status;
        this.files = _files;
        this.user = _user;
        this.attachments = _attachments;
        this.recipents = _recipent;
    }
}
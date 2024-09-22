export class Attachment{
    id: number;
    fileName: string;
    filePath: string;
    ticketId: string;

    constructor(_id: number, _fileName: string, _filePath: string, _ticketId: string){
        this.id = _id;
        this.fileName = _fileName;
        this.filePath = _filePath;
        this.ticketId = _ticketId;
    }
}
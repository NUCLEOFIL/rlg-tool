import { SafeUrl } from "@angular/platform-browser";

export class LinkedFile {

    id: number;
    folder: string = 'others';
    extension: string | undefined = '';
    name: string;
    file: File;
    fileURL: SafeUrl;
    mimeType: string;

    constructor(id: number, file: File, fileURL: SafeUrl) {
        this.id = id;
        this.extension = file.name.split('.').pop();
        this.name = file.name.replace('.'+this.extension, '');
        this.file = file;
        this.fileURL = fileURL;
        this.mimeType = file.type;

        let imageTypePattern = /image\//;
        let videoTypePattern = /video\//;
        let audioTypePattern = /audio\//;
        if (imageTypePattern.test(file.type)) {
            this.folder = 'images';
        } else if (videoTypePattern.test(file.type)) {
            this.folder = 'videos';
        } else if (audioTypePattern.test(file.type)) {
            this.folder = 'audios';
        }
    }
}

import { SafeUrl } from "@angular/platform-browser";

export class LinkedFile {

    id: number;
    folder: string = 'others';
    extension: string | undefined = '';
    name: string;
    file: File;
    fileURL: SafeUrl;

    constructor(id: number, file: File, fileURL: SafeUrl) {
        this.id = id;
        this.name = file.name;
        this.extension = file.name.split('.').pop();
        this.file = file;
        this.fileURL = fileURL;

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

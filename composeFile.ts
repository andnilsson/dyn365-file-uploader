import { Webresource, FileType } from './fileoperations';
import fs = require('fs');
import * as en from 'linq';
import tl = require('vsts-task-lib/task');

const filesuffixes = [
    "htm",
    "html",
    "css",
    "js",
    "xml",
    "png",
    "jpg",
    "gif",
    "map"
];

export function isValidFile(filename: string): boolean {
    var parts = filename.split('.');
    var value = filesuffixes.indexOf(parts[parts.length - 1]) > -1;    
    return value;
}

function getFileType(filename: string): FileType {
    if (filename.indexOf(".htm") > -1)
        return FileType.html;
    else if (filename.indexOf(".css") > -1)
        return FileType.css;
    else if (filename.indexOf(".htm") > -1)
        return FileType.html;
    else if (filename.indexOf(".js") > -1)
        return FileType.js;
    else if (filename.indexOf(".xml") > -1)
        return FileType.xml;
    else if (filename.indexOf(".png") > -1)
        return FileType.png;
    else if (filename.indexOf(".jpg") > -1)
        return FileType.jpg;
    else if (filename.indexOf(".gif") > -1)
        return FileType.gif;
    else return FileType.unknown
}

export function createSingleWebResource(filename: string, sourcepath: string, publisher): Webresource {
    if (!isValidFile(filename)) return null;

    var content = fs.readFileSync(filename, 'base64');
    var wr = {
        name: `${publisher}${filename.split(sourcepath)[1]}`.split('\\').join('/'),
        path: filename,
        content: content,        
    } as Webresource
    wr.webresourcetype = getFileType(wr.name);
    return wr;
}

export async function createWebResourcesAsync(sourcepath: string, publisher: string): Promise<Webresource[]> {
    return new Promise<Webresource[]>((resolve, reject) => {

        var allFiles = en.from(tl.find(sourcepath) as [string]).where(f => isValidFile(f));
        var resources = allFiles.select((file) => {
            var content = fs.readFileSync(file, 'base64');
            var wr = {
                name: `${publisher}${file.split(sourcepath)[1]}`.split('\\').join('/'),
                path: file,
                content: content,
            } as Webresource
            wr.webresourcetype = getFileType(wr.name);
            return wr;
        }).toArray();

        resolve(resources);
    });

}
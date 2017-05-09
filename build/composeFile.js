"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileoperations_1 = require("./fileoperations");
const fs = require("fs");
const en = require("linq");
const tl = require("vsts-task-lib/task");
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
function isValidFile(filename) {
    var parts = filename.split('.');
    var value = filesuffixes.indexOf(parts[parts.length - 1]) > -1;
    return value;
}
exports.isValidFile = isValidFile;
function getFileType(filename) {
    if (filename.indexOf(".htm") > -1)
        return fileoperations_1.FileType.html;
    else if (filename.indexOf(".css") > -1)
        return fileoperations_1.FileType.css;
    else if (filename.indexOf(".htm") > -1)
        return fileoperations_1.FileType.html;
    else if (filename.indexOf(".js") > -1)
        return fileoperations_1.FileType.js;
    else if (filename.indexOf(".xml") > -1)
        return fileoperations_1.FileType.xml;
    else if (filename.indexOf(".png") > -1)
        return fileoperations_1.FileType.png;
    else if (filename.indexOf(".jpg") > -1)
        return fileoperations_1.FileType.jpg;
    else if (filename.indexOf(".gif") > -1)
        return fileoperations_1.FileType.gif;
    else
        return fileoperations_1.FileType.unknown;
}
function createSingleWebResource(filename, sourcepath, publisher) {
    if (!isValidFile(filename))
        return null;
    var content = fs.readFileSync(filename, 'base64');
    var wr = {
        name: `${publisher}${filename.split(sourcepath)[1]}`.split('\\').join('/'),
        path: filename,
        content: content,
    };
    wr.webresourcetype = getFileType(wr.name);
    return wr;
}
exports.createSingleWebResource = createSingleWebResource;
function createWebResourcesAsync(sourcepath, publisher) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var allFiles = en.from(tl.find(sourcepath)).where(f => isValidFile(f));
            var resources = allFiles.select((file) => {
                var content = fs.readFileSync(file, 'base64');
                var wr = {
                    name: `${publisher}${file.split(sourcepath)[1]}`.split('\\').join('/'),
                    path: file,
                    content: content,
                };
                wr.webresourcetype = getFileType(wr.name);
                return wr;
            }).toArray();
            resolve(resources);
        });
    });
}
exports.createWebResourcesAsync = createWebResourcesAsync;
//# sourceMappingURL=composeFile.js.map
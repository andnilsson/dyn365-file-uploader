"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const unirest = require("unirest");
const en = require("linq");
function uploadFileAsync(file, baseurl, apiversion, accesstoken) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var uri = `${baseurl}/api/data/v${apiversion}/webresourceset`;
            if (file.id)
                uri += `(${file.id})`;
            var req = unirest(file.id ? "PATCH" : "POST", uri);
            req.headers({
                "content-type": "application/json",
                "authorization": `Bearer ${accesstoken}`
            });
            req.type("json");
            req.send({
                "content": file.content,
                "name": file.name,
                "displayname": file.name,
                "webresourcetype": file.webresourcetype
            });
            req.end(function (res) {
                if (res.error) {
                    console.log("Errror: " + res.body);
                    reject(res.error);
                }
                resolve(true);
            });
        });
    });
}
exports.uploadFileAsync = uploadFileAsync;
function getExistingFileIdsAsync(files, baseurl, apiversion, accesstoken) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            console.log("Starting reteiving existing web resources");
            if (files.length < 1) {
                resolve([]);
                return;
            }
            var filter = files.map((file, index) => `contains(name, '${file.name}') or `).join('').slice(0, -4);
            var uri = `${baseurl}/api/data/v${apiversion}/webresourceset`;
            var req = unirest("GET", uri);
            req.query({
                "$select": "webresourceid,name",
                "$filter": filter
            });
            req.headers({
                "content-type": "application/json",
                "authorization": `Bearer ${accesstoken}`
            });
            req.type("json");
            req.send();
            req.end((res) => {
                if (res.error)
                    throw new Error(res.error);
                if (!res.body || !res.body.value) {
                    resolve(files);
                    return;
                }
                var resources = en.from(res.body.value);
                files.forEach((file) => {
                    file.id = resources.where(x => x.name === file.name).firstOrDefault() ? resources.where(x => x.name === file.name).firstOrDefault().webresourceid : null;
                });
                console.log(`found ${files.length} web resources`);
                resolve(files);
            });
        });
    });
}
exports.getExistingFileIdsAsync = getExistingFileIdsAsync;
var FileType;
(function (FileType) {
    FileType[FileType["html"] = 1] = "html";
    FileType[FileType["css"] = 2] = "css";
    FileType[FileType["js"] = 3] = "js";
    FileType[FileType["xml"] = 4] = "xml";
    FileType[FileType["png"] = 5] = "png";
    FileType[FileType["jpg"] = 6] = "jpg";
    FileType[FileType["gif"] = 7] = "gif";
    FileType[FileType["unknown"] = -1] = "unknown";
})(FileType = exports.FileType || (exports.FileType = {}));
class Webresource {
}
exports.Webresource = Webresource;
//# sourceMappingURL=fileoperations.js.map
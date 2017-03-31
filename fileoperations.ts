import * as unirest from "unirest"
import * as en from 'linq';

export async function uploadFileAsync(file: Webresource, baseurl: string, apiversion: string, accesstoken: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        var uri = `${baseurl}/api/data/v${apiversion}/webresourceset`;
        if(file.id)
            uri += `(${file.id})`
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
            "webresourcetype": file.type
        });

        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            resolve(true);
        });
    });
}

export async function getExistingFileIdsAsync(files: Webresource[], baseurl: string, apiversion: string, accesstoken: string): Promise<Webresource[]> {
    return new Promise<Webresource[]>((resolve, reject) => {
        console.log("Starting reteiving existing web resources");

        if(files.length < 1){
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
            if (res.error) throw new Error(res.error);
            if (!res.body || !res.body.value) {
                resolve(files);
                return;
            }
            var resources = en.from(res.body.value as any[]);
            files.forEach((file) => {
                file.id = resources.where(x => x.name === file.name).firstOrDefault() ? resources.where(x => x.name === file.name).firstOrDefault().webresourceid : null
            });
            console.log(`found ${files.length} web resources`);
            resolve(files);
        });
    });
}

export enum FileType {
    html = 1,
    css = 2,
    js = 3,
    xml = 4,
    png = 5,
    jpg = 6,
    gif = 7,
    unknown = -1
}

export class Webresource {
    id: string;
    name: string;
    path: string;
    content: string;
    type: FileType
}
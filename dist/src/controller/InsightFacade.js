"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
const QueryUtil_1 = require("./Query/QueryUtil");
const TransformationUtil_1 = require("./Query/TransformationUtil");
const ValidationUtil_1 = require("./QueryValidation/ValidationUtil");
const AddUtil_1 = require("./Add/AddUtil");
const jszip_1 = __importDefault(require("jszip"));
const fs = __importStar(require("fs-extra"));
const parse5_1 = require("parse5");
const DatasetKeyUtil_1 = require("./QueryValidation/DatasetKeyUtil");
function checkFields(sectionData) {
    if (("Subject" in sectionData) && ("id" in sectionData) &&
        ("Avg" in sectionData) &&
        ("Professor" in sectionData) &&
        ("Title" in sectionData) &&
        ("Pass" in sectionData) &&
        ("Fail" in sectionData) &&
        ("Audit" in sectionData) &&
        ("id" in sectionData) &&
        ("Year" in sectionData)) {
        return true;
    }
    return false;
}
class InsightFacade {
    constructor() {
        this.addedIds = new Map();
        this.arrayRooms = [];
        this._data = [];
        this.num = 0;
    }
    set data(value) {
        this._data = value;
    }
    async courseDataParse(id, content, kind) {
        let zip = new jszip_1.default();
        return zip.loadAsync(content, { base64: true }).then((contents) => {
            let promArray = [];
            contents.forEach(function (relativePath, file) {
                promArray.push(file.async("string"));
            });
            let arraySections = [];
            return Promise.all(promArray).then((resultingArray) => {
                for (let each of resultingArray) {
                    try {
                        let obj = JSON.parse(each);
                        for (let eachSub of obj.result) {
                            if (checkFields(eachSub)) {
                                arraySections.push(eachSub);
                            }
                        }
                    }
                    catch (e) {
                        continue;
                    }
                }
                arraySections.push(kind);
                this.addedIds.set(id, arraySections);
                fs.mkdirsSync("data");
                fs.writeFileSync("data/" + id, JSON.stringify(this.addedIds.get(id)));
            });
        }).catch((error) => {
            throw new IInsightFacade_1.InsightError("problem reading or writing");
        });
    }
    recursiveParseTable(document) {
        if (document.nodeName === "table") {
            this.tableNode = document;
        }
        if ("childNodes" in document) {
            for (let each of document.childNodes) {
                this.recursiveParseTable(each);
            }
        }
    }
    async roomDataParse(id, content, kind) {
        let zip = new jszip_1.default();
        this.arrayRooms = [];
        let contents = zip.loadAsync(content, { base64: true });
        let html = contents.then((contentsLoaded) => {
            return contentsLoaded.files["rooms/index.htm"].async("string");
        });
        return Promise.all([contents, html]).then((indexRead) => {
            let document = (0, parse5_1.parse)(indexRead[1]);
            this.recursiveParseTable(document);
            return (0, AddUtil_1.processIndexTable)(this.tableNode, indexRead[0]);
        }).then((datArray) => {
            this.arrayRooms = datArray;
            this.arrayRooms.push(kind);
            this.addedIds.set(id, this.arrayRooms);
            fs.mkdirsSync("data");
            fs.writeFileSync("data/" + id, JSON.stringify(this.addedIds.get(id)));
        }).catch((error) => {
            throw new IInsightFacade_1.InsightError("problem reading or writing");
        });
    }
    async addDataset(id, content, kind) {
        if (id.includes("_")) {
            throw new IInsightFacade_1.InsightError("id has underscore");
        }
        if (!id.replace(/\s/g, "").length) {
            throw new IInsightFacade_1.InsightError("id only has whitespaces");
        }
        if (this.addedIds.has(id)) {
            throw new IInsightFacade_1.InsightError("id already exists");
        }
        if (kind === "rooms") {
            await this.roomDataParse(id, content, kind);
        }
        else {
            await this.courseDataParse(id, content, kind);
        }
        return Array.from(this.addedIds.keys());
    }
    async removeDataset(id) {
        if (id.includes("_")) {
            throw new IInsightFacade_1.InsightError("id has underscore");
        }
        if (!id.replace(/\s/g, "").length) {
            throw new IInsightFacade_1.InsightError("id only has whitespaces");
        }
        if (!(Array.from(this.addedIds.keys()).includes(id))) {
            throw new IInsightFacade_1.NotFoundError("id not added yet");
        }
        this.addedIds.delete(id);
        fs.unlinkSync("data/" + id);
        return id;
    }
    performQuery(query) {
        const where = query.WHERE;
        const options = query.OPTIONS;
        const transformations = query.TRANSFORMATIONS;
        let filteredData = [];
        if (!options || !where) {
            throw new IInsightFacade_1.InsightError();
        }
        let id = (0, DatasetKeyUtil_1.getQueryId)(query);
        let dataset = this.findDataset(id);
        let data = this.addedIds.get(id);
        if (typeof data === "undefined") {
            throw new IInsightFacade_1.InsightError("data not defined");
        }
        let type;
        type = data[data.length - 1];
        (0, ValidationUtil_1.checkValidQuery)(query, type);
        if (Object.keys(where).length !== 0) {
            filteredData = (0, QueryUtil_1.filterData)(data.slice(0, data.length - 1), where, type);
        }
        else {
            filteredData = data.slice(0, data.length - 1);
        }
        if (transformations) {
            filteredData = (0, TransformationUtil_1.filterTransformation)(filteredData, transformations, type);
        }
        if (filteredData.length > 5000) {
            throw new IInsightFacade_1.ResultTooLargeError();
        }
        filteredData = (0, QueryUtil_1.filterOptions)(filteredData, options, type);
        return Promise.resolve(filteredData);
    }
    findDataset(id) {
        return [];
    }
    async listDatasets() {
        let arrayAddedsets = [];
        for (const [key, value] of this.addedIds.entries()) {
            arrayAddedsets.push({ id: key, kind: value[value.length - 1], numRows: value.length - 1 });
        }
        return arrayAddedsets;
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map
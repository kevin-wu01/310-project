import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions } from "./Query/QueryUtil";
import {filterTransformation} from "./Query/TransformationUtil";
import {checkValidQuery} from "./QueryValidation/ValidationUtil";
import {processIndexTable} from "./Add/AddUtil";
import JSZip from "jszip";
import * as fs from "fs-extra";
import {Document, parse} from "parse5";
import { transferPromiseness } from "chai-as-promised";
import { Console } from "console";
import { read } from "fs";
import {getQueryId} from "./QueryValidation/DatasetKeyUtil";

function checkFields(sectionData: any) {
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


/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {

	private addedIds = new Map();
	private tableNode: any;
	private arrayRooms: any = [];

	private set data(value: any[]) {
		this._data = value;
	}

	private _data: any[];
	private num: number;

	constructor() {
		// console.trace("InsightFacadeImpl::init()");
		// let dataObject: any[] = [];
		this._data = [];
		this.num = 0;
	}

	private async courseDataParse(id: string, content: string, kind: InsightDatasetKind) {
		let zip = new JSZip();
		return zip.loadAsync(content, {base64: true}).then((contents) => {
			let promArray: Array<Promise<string>> = [];
			contents.forEach(function (relativePath, file) {
				promArray.push(file.async("string"));
				// console.log(relativePath);
			});

			let arraySections: any = [];
			return Promise.all(promArray).then((resultingArray) => {
				// console.log("rA length : ", resultingArray.length);
				for (let each of resultingArray) {
					try {
						let obj: any = JSON.parse(each);
						// let result = obj.result;
						// console.log(obj.result.length);
						for (let eachSub of obj.result) {
							if (checkFields(eachSub)) {
								arraySections.push(eachSub);
							}
						}
					} catch (e) {
						continue;
					}
				}

				// console.log("aS length: ", arraySections.length);
				arraySections.push(kind);
				this.addedIds.set(id, arraySections);
				fs.mkdirsSync("data");
				fs.writeFileSync("data/" + id, JSON.stringify(this.addedIds.get(id)));
			});

		}).catch((error) => {
			throw new InsightError("problem reading or writing");
		});
	}

	private recursiveParseTable(document: any) {
		// console.log(document.childNodes.length, document.nodeName);
		if (document.nodeName === "table") {
			this.tableNode = document;
		}
		if ("childNodes" in document) {
			for (let each of document.childNodes) {
				this.recursiveParseTable(each);
			}
		}
	}

	private async roomDataParse(id: string, content: string, kind: InsightDatasetKind) {
		let zip = new JSZip();
		this.arrayRooms = [];
		let contents = zip.loadAsync(content, {base64: true});
		let html = contents.then((contentsLoaded) => {
			return contentsLoaded.files["rooms/index.htm"].async("string");
		});
		return Promise.all([contents, html]).then((indexRead) => {
			let document = parse(indexRead[1]);
			this.recursiveParseTable(document);
			return processIndexTable(this.tableNode, indexRead[0]);
		}).then((datArray) => {
			this.arrayRooms = datArray;
			this.arrayRooms.push(kind);

			this.addedIds.set(id, this.arrayRooms);
			fs.mkdirsSync("data");
			fs.writeFileSync("data/" + id, JSON.stringify(this.addedIds.get(id)));
			// console.log(this.addedIds);
		}).catch((error) => {
			throw new InsightError("problem reading or writing");
		});
	}


	public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		if (id.includes("_")) {
			throw new InsightError("id has underscore");
		}

		// https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces/50971250
		if (!id.replace(/\s/g, "").length) {
			throw new InsightError("id only has whitespaces");
		}

		if (this.addedIds.has(id)) {
			throw new InsightError("id already exists");
		}

		if (kind === "rooms") {
			await this.roomDataParse(id, content, kind);
		} else {
			await this.courseDataParse(id, content, kind);
		}

		return Array.from(this.addedIds.keys());
	}

	public async removeDataset(id: string): Promise<string> {

		if (id.includes("_")) {
			throw new InsightError("id has underscore");
		}

		// https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces/50971250
		if (!id.replace(/\s/g, "").length) {
			throw new InsightError("id only has whitespaces");
		}

		if (!(Array.from(this.addedIds.keys()).includes(id))) {
			throw new NotFoundError("id not added yet");
		}

		this.addedIds.delete(id);
		fs.unlinkSync("data/" + id);
		return id;

		// return fs.readFile("data/" + id, "string").then((contents) => {
		// 	this.addedIds.delete(id);
		// 	// let obj: any = new Map(JSON.parse(contents));
		// 	// obj.delete(id);
		// 	// fs.writeFileSync("data/insightDataset", JSON.stringify(Object.fromEntries(obj)));
		// 	return id;
		// });
	}

	public performQuery(query: any): Promise<any[]> {
		const where: Record<string, any> = query.WHERE;
		const options: Record<string, any> = query.OPTIONS;
		const transformations: Record<string, any> = query.TRANSFORMATIONS;
		let filteredData: any[] = [];

		if (!options || !where) {
			throw new InsightError();
		}

		let id: string = getQueryId(query);
		let dataset: any[] = this.findDataset(id);
		let data: any[] = this.addedIds.get(id);

		if (typeof data === "undefined") {
			throw new InsightError("data not defined");
		}
		let type: string;
		/*
		if (typeof data[data.length - 1] === "string") {
			type = data.pop();
		} else {
			type = "courses";
		}
		*/
		type = data[data.length - 1];
		console.log(type, "type");
		checkValidQuery(query, type); // id is being found again
		// this.addedIds.get(id);
		// data.slice(0, data.length - 2)
		if (Object.keys(where).length !== 0) {
			filteredData = filterData(data.slice(0, data.length - 1), where, type);
		} else {
			filteredData = data.slice(0, data.length - 1);
		}

		// filteredData = formatData(filteredData, id);
		if (transformations) {
			filteredData = filterTransformation(filteredData, transformations, type);
		}

		if (filteredData.length > 5000) {
			throw new ResultTooLargeError();
		}
		// console.log(filteredData.length, "length");
		filteredData = filterOptions(filteredData, options, type);
		// data.push(type);
		return Promise.resolve(filteredData);
	}

	private findDataset(id: string): any[] {
		return [];
	}

	public async listDatasets(): Promise<InsightDataset[]> {
		let arrayAddedsets: InsightDataset[] = [];

		for (const [key,value] of this.addedIds.entries()) {
			arrayAddedsets.push({id: key, kind: value[value.length - 1], numRows: value.length - 1});
		}
		return arrayAddedsets;
	}
}

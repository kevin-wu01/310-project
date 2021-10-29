import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions } from "./QueryUtil";
import {checkValidQuery} from "./ValidationUtil";
import JSZip from "jszip";
import * as fs from "fs";

function checkFields(sectionData: any) {
	if (("dept" in sectionData) && ("id" in sectionData) &&
		("avg" in sectionData) &&
		("instructor" in sectionData) &&
		("title" in sectionData) &&
		("pass" in sectionData) &&
		("fail" in sectionData) &&
		("audit" in sectionData) &&
		("uuid" in sectionData) &&
		("year" in sectionData)) {
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

// 		fs.readFile("./test/data/courses2.zip", (err, data) => {
// 			console.log("data", data);
// 			if (!err) {
// 				let zip = new JSZip();
// 				zip.loadAsync(data).then((contents) => {
// 					console.log("contents", contents);
// 					Object.keys(contents.files).forEach((filename) => {
// 						zip.file(filename)?.async("string").then((text) => {
// 							dataObject.push(text);
// 						});
// 					});
// 					// console.log(dataObject);
// 					/*
// 					contents.folder("courses").forEach(function (filename, file) {
// 						console.log(filename);
// 						console.log("file", file);
// 					});
// 					if (typeof Object.values(contents) !== null) {
// 						Object.values(contents).forEach((course: any) => {
// 							this.data.push(course);
// 						});
// 					}
// 					*/
// 					// console.log("first index", this.data[0]);
// 					// console.log("this.data", this.data);
// 					/*
// 					Object.keys(contents.files).forEach(function(filename) {
// 						console.log("filename", filename);
// 						zip.file(filename)!.async("nodebuffer").then(function(content) {
// 							console.log("zip file", content);
// 						});
// 					});
// 					 */
// 				});
// 			}
// 		});
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

		let zip = new JSZip();

		return zip.loadAsync(content, {base64: true}).then((contents) => {
			let promArray: Array<Promise<string>> = [];
			contents.forEach(function (relativePath, file) {
				promArray.push(file.async("string"));
			});

			let arraySections: any = [];
			Promise.all(promArray).then((resultingArray) => {

				for (let each of resultingArray) {
					try {
						let obj: any = JSON.parse(each);
						// let result = obj.result;
						for (let eachSub of obj.result) {
							if (checkFields(eachSub)) {
								arraySections.push(eachSub);
							}
						}
					} catch (e) {
						continue;
					}
				}
			});

			this.addedIds.set(id, arraySections);
			fs.writeFileSync("./insightdata", Object.fromEntries(this.addedIds));

			return Array.from(this.addedIds.keys());

		}).catch((error) => {
			throw new InsightError("problem reading or writing");
		});
	}

	public removeDataset(id: string): Promise<string> {
		return Promise.resolve("");
	}

	public performQuery(query: any): Promise<any[]> {
		const where: Record<string, any> = query.WHERE;
		const options: Record<string, any> = query.OPTIONS;
		let filteredData: any[] = [];

		if (!options) {
			throw new InsightError();
		}

		let id: string = checkValidQuery(query);
		let dataset: any[] = this.findDataset(id);

		if (Object.keys(where).length !== 0) {
			filteredData = filterData(this.addedIds.get(id), where);
		} else {
			filteredData = []; // stub
		}

		if (filteredData.length > 5000) {
			throw new ResultTooLargeError();
		}

		filteredData = filterOptions(filteredData, options);

		return Promise.resolve(filteredData);
	}

	private findDataset(id: string): any[] {
		return [];
	}

	private checkValidKey(key: string): void {
		const validKeys: string[] = ["avg", "pass", "fail", "audit", "year",
			"dept", "id", "instructor", "title", "uuid"];

		if (!validKeys.includes(key)) {
			throw new InsightError();
		}
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return Promise.reject("Not implemented.");
	}
}

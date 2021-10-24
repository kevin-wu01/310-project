import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions, checkValidID } from "./QueryUtil";
import JSZip from "jszip";
import * as fs from "fs";


/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	private data: any[] = [];

	constructor() {
		// console.trace("InsightFacadeImpl::init()");
		let dataObject: any[] = [];

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

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		let zip = new JSZip();
		let buffer = new Buffer(content, "base64");
		/*
		zip.loadAsync(content.toString()).then((contents) => {
			Object.keys(contents.files).forEach((fileName) => {
				zip.file(fileName)?.async("string").then((text) => {
					this.data.push(text);
				});
			});
		});
		*/

		return Promise.resolve([]);
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

		let id: string = checkValidID(options);
		let dataset: any[] = this.findDataset(id);

		if (Object.keys(where).length !== 0) {
			filteredData = filterData(dataset, where);
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

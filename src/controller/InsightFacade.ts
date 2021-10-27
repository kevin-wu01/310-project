import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions } from "./QueryUtil";
import {checkValidQuery} from "./ValidationUtil";
import JSZip from "jszip";
import * as fs from "fs";


/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {

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
		let zip = new JSZip();
		let array: any[] = [];
		// let buffer = new Buffer(content, "base64");

		await zip.loadAsync(content, {base64: true}).then(async (contents) => {
			/*
			Object.keys(contents.files).forEach((fileName) => {
				// console.log(fileName);
				zip.file(fileName)?.async("string").then((text) => {
					// console.log(text.substring(0,10));
					console.log(this.data);
					this.data.push(text);
					// console.log(array);
					// console.log("this.data", this.data[0].substr(1, 20));
				});
			});
			*/
			for (let fileName of Object.keys(contents.files)) {
				await zip.file(fileName)?.async("string").then((text) => {
					// console.log("also data", this.data);
					array.push(text);
					this.num = 1;
					// console.log("num", this.num);
				});
			}
			/*
			for (let i = 0; i < Object.keys(contents.files).length; i++) {
				await zip.file(Object.keys(contents.files)[i])?.async("string").then((text) => {
					// console.log("also data", this.data);
					array.push(text);
					this.num = 1;
					// console.log("num", this.num);
				});
			}
			*/
			//  console.log(array, "array");
			this._data = array;
			// console.log(this._data);
			// console.log("outside num", this.num);
			// this.data = array;
			// console.log("data", this.data);
			return Promise.resolve([]);
		});

		return Promise.resolve([]);
		/*
		console.log("array", array);
		this.data = array;
		console.log("outside loop", this.data);

		 */
		/*
		zip.loadAsync(content).then((contents) => {
			console.log(contents);
		});
		*/

		// console.log(atob(content));
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
		return Promise.resolve([]); // test for validation
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

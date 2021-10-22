import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions } from "./QueryUtil";
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

		fs.readFile("./test/data/courses2.zip", (err, data) => {
			console.log(data);
			if (!err) {
				let zip = new JSZip();
				zip.loadAsync(data).then((contents) => {
					// console.log("contents", contents);
					// console.log("values", Object.values(contents));
					// console.log(typeof contents === "object");
					// console.log("is array", Array.isArray(Object.values(contents)));
					// console.log("is object", typeof contents === "object");
					// console.log(Object.values(contents)[0]);
					// console.log(typeof contents.folder("courses"));

					Object.keys(contents.files).forEach((filename) => {
						zip.file(filename)?.async("string").then((text) => {
							dataObject.push(text);
						});
					});
					console.log(dataObject);
					/*
					contents.folder("courses").forEach(function (filename, file) {
						console.log(filename);
						console.log("file", file);
					});
					if (typeof Object.values(contents) !== null) {
						Object.values(contents).forEach((course: any) => {
							this.data.push(course);
						});
					}
					*/
					// console.log("first index", this.data[0]);
					// console.log("this.data", this.data);
					/*
					Object.keys(contents.files).forEach(function(filename) {
						console.log("filename", filename);
						zip.file(filename)!.async("nodebuffer").then(function(content) {
							console.log("zip file", content);
						});
					});
					 */
				});
			}
		});

		/*
		let jsZip = require("jszip");
		jsZip.loadAsync("../../test/data/courses.zip").then((zip: any) => {
			console.log("zip", zip);
			Object.keys(zip.files).forEach((filename) => {
				zip.files[filename].async("string").then((fileData: any) => {
					console.log("fileData", fileData);
					this.data = fileData;
					console.log("data", this.data);
				});
			});
		}).catch((err: any) => {
			console.log(err);
		});
		*/
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		let zip = new JSZip();
		// let buffer: Buffer =

		zip.loadAsync(content).then((contents) => {
			console.log(contents);
			Object.keys(contents.files).forEach((fileName) => {
				zip.file(fileName)?.async("string").then((text) => {
					return;
				});
			});
		});


		return Promise.resolve([]);
	}

	public removeDataset(id: string): Promise<string> {
		return Promise.resolve("");
	}

	public performQuery(query: any): Promise<any[]> {
		const where: Record<string, any> = query.WHERE;
		const options: Record<string, any> = query.OPTIONS;

		let filteredData: any[] = filterData([], where);

		if (filteredData.length > 5000) {
			throw new ResultTooLargeError();
		}

		filteredData = filterOptions(filteredData, options);

		return Promise.resolve(filteredData);
	}
	/*
	private filterData(data: any[], query: any): any[] {
		const queryString: string = Object.keys(query)[0];

		if (!queryString) {
			return data;
		}

		switch(queryString) {
		case "LT":
			this.checkValidMComparator(query);
			data = this.filterMComparator(data, "LT", Object.keys(query.LT)[0], query[Object.keys(query.LT)[0]]);
			// lower than
			break;
		case "GT":
			this.checkValidMComparator(query);
			data = this.filterMComparator(data, "GT", Object.keys(query.GT)[0], query[Object.keys(query.LT)[0]]);
			// greater than
			break;
		case "EQ":
			this.checkValidMComparator(query);
			data = this.filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query[Object.keys(query.LT)[0]]);
			// equal to
			break;
		case "AND":
			// intersection of recursion
			data = this.filterAND(data, query.AND);
			break;
		case "OR":
			// union of recursion
			data = this.filterOR(data, query.OR);
			break;
		case "IS":
			break;
		case "NOT":
			break;
		default: throw new InsightError();
		}

		return data;
	}
	*/
	private filterAND(data: any[], queryArray: any): any[] {
		let queryResults: any[] = [];

		for (let query of queryArray) {
			queryResults.push(filterData(data, query));
		}

		queryResults = queryResults.reduce((a, b) => a.filter((c: any) => b.includes(c))); // intersection of multiple arrays

		return queryResults;
	}

	private filterOR(data: any[], queryArray: any): any[] {
		let queryResults: any[] = [];

		for (let query of queryArray) {
			queryResults.push(filterData(data, query));
		}

		queryResults = queryResults.filter((classData, index, self) => {
			return index === self.findIndex((t) => {
				return t.name === classData.name; // replace with data properties
			});
		});


		return queryResults;
	}

	private checkValidMComparator(query: any): void {
		if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
			throw new InsightError();
		}

		if (typeof query[Object.keys(query)[0]] !== "number") {
			throw new InsightError();
		}
	}

	private filterMComparator(data: any[], comparator: string, field: string, value: number): any[] {
		let filteredData: any[] = [];

		switch(comparator) {
		case "LT":
			filteredData = data.filter((dataClass) => {
				return dataClass[field] < value;
			});
			break;
		case "GT":
			filteredData = data.filter((dataClass) => {
				return dataClass[field] > value;
			});
			break;
		case "EQ":
			filteredData = data.filter((dataClass) => {
				return dataClass[field] === value;
			});
			break;
		}

		return filteredData;
	}
	/*
	private filterOptions(data: any[], query: any): any[] {
		const dataColumns: string[] = query.COLUMNS;
		const sortColumn: string = query.ORDER.split("_")[1];
		let filteredData: any[] = [];

		if (dataColumns.length === 0) {
			throw new InsightError();
		}

		this.checkValidKey(sortColumn);
		for (let key of dataColumns) {
			this.checkValidKey(key.split("_")[1]);
		}

		for (let section = 0; section < data.length; section++) {
			filteredData.push({});

			for (let key of dataColumns) {
				let substrKey: string = key.split("_")[1];
				filteredData[section][substrKey] = data[section][substrKey];
			}
		}

		filteredData.sort((a,b) => {
			return a[sortColumn] - b[sortColumn];
		});

		return filteredData;
	}
	*/
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

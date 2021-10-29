import {IInsightFacade, InsightDataset, InsightDatasetKind,
	InsightError, NotFoundError, ResultTooLargeError} from "./IInsightFacade";
import {filterData, filterOptions } from "./QueryUtil";
import {checkValidQuery} from "./ValidationUtil";
import JSZip from "jszip";
import * as fs from "fs-extra";

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
				// console.log("nlkfnglksndlngf");
				// fs.writeJSON("./data/insightData.json", Object.fromEntries(this.addedIds)).then(() => 
				// {return Array.from(this.addedIds.keys());}).catch((e) => {console.log(e)});

				// console.log(process.cwd());
				// console.log(this.addedIds.size);
				// console.log(this.addedIds.get("courses").length);
				return Array.from(this.addedIds.keys());

			});
			

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

	public async listDatasets(): Promise<InsightDataset[]> {
		let arrayAddedsets: InsightDataset[] = [];

		for (const [key,value] of this.addedIds.entries()) {
			arrayAddedsets.push({id: key, kind: value[value.length - 1], numRows: value.length - 1});
		}
		return arrayAddedsets;
	}
}

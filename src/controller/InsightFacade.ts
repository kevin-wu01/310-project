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
				fs.mkdirsSync("data");
				fs.writeFileSync("data/insightDataset", JSON.stringify(Object.fromEntries(this.addedIds)));
				return Array.from(this.addedIds.keys());

			});

		}).catch((error) => {
			throw new InsightError("problem reading or writing");
		});
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

		return fs.readFile("data/insightDataset", "string").then((contents) => {
			this.addedIds.delete(id);
			let obj: any = new Map(JSON.parse(contents));
			obj.delete(id);
			fs.writeFileSync("data/insightDataset", JSON.stringify(Object.fromEntries(obj)));
			return id;
		});
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

	public async listDatasets(): Promise<InsightDataset[]> {
		let arrayAddedsets: InsightDataset[] = [];

		for (const [key,value] of this.addedIds.entries()) {
			arrayAddedsets.push({id: key, kind: value[value.length - 1], numRows: value.length - 1});
		}
		return arrayAddedsets;
	}
}

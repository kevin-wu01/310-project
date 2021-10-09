import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
	constructor() {
		console.trace("InsightFacadeImpl::init()");
	}

	public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
		return Promise.resolve([]);
	}

	public removeDataset(id: string): Promise<string> {
		return Promise.resolve("");
	}

	public performQuery(query: any): Promise<any[]> {
		const where: Record<string, any> = query.WHERE;
		const options: Record<string, any> = query.OPTIONS;

		let queryString: string = Object.keys(where)[0];

		let filteredData: any[] = this.filterData(queryString);

		return Promise.resolve([]);
	}

	private filterData(query: any): any[] {
		if (!query) {
			//return array of data
		}

		let nextQuery: string[] = Object.keys(query);

		switch(query) {
		case "LT":
			//lower than 
			break;
		case "GT":
			//greater than
			break;
		case "EQ":
			//equal to 
			break;
		case "AND":
			//intersection of recursion 
			this.filterAND(nextQuery);
			break;
		case "OR":
			//union of recursion
			this.filterOR(nextQuery);
			break;
		default: throw new InsightError();
		}

		return [];
	}

	private filterAND(query: any): any[] {
		return [];
	}

	private filterOR(query: any): any[] {
		return [];
	}

	public listDatasets(): Promise<InsightDataset[]> {
		return Promise.reject("Not implemented.");
	}
}

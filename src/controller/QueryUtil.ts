import {InsightError} from "./IInsightFacade";

function filterData(data: any[], query: any): any[] {
	const queryString: string = Object.keys(query)[0];
	let removeData: any[];

	switch(queryString) {
		case "LT":
			data = filterMComparator(data, "LT", Object.keys(query.LT)[0], query[Object.keys(query.LT)[0]]);
			break;
		case "GT":
			data = filterMComparator(data, "GT", Object.keys(query.GT)[0], query[Object.keys(query.LT)[0]]);
			break;
		case "EQ":
			data = filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query[Object.keys(query.LT)[0]]);
			break;
		case "AND":
			data = filterAND(data, query.AND);
			break;
		case "OR":
			data = filterOR(data, query.OR);
			break;
		case "IS":
			data = filterSComparator(data, Object.keys(query.IS)[0], query[Object.keys(query.IS)[0]]);
			break;
		case "NOT":
			removeData = filterData(data, query.NOT);
			data = data.filter((x) => !removeData.includes(x));
			break;
		default: throw new InsightError();
	}

	return data;
}

function filterAND(data: any[], queryArray: any): any[] {
	let queryResults: any[] = [];

	for (let query of queryArray) {
		queryResults.push(filterData(data, query));
	}

	queryResults = queryResults.reduce((a, b) => a.filter((c: any) => b.includes(c)));

	return queryResults;
}

function filterOR(data: any[], queryArray: any): any[] {
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

function filterMComparator(data: any[], comparator: string, field: string, value: number): any[] {
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

function filterOptions(data: any[], query: any): any[] {
	const dataColumns: string[] = query.COLUMNS;
	const sortColumn: string = query.ORDER.split("_")[1];
	let filteredData: any[] = [];

	if (dataColumns.length === 0) {
		throw new InsightError();
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

function filterSComparator(data: any[], field: string, value: string) {
	if (field !== "dept" && field !== "id" && field !== "instructor" && field !== "title" && field !== "uuid") {
		throw new InsightError();
	}
	let filteredData: any[];

	filteredData = data.filter((dataClass) => {
		return dataClass[field] === value;
	});

	return filteredData;

}


export {filterData, filterOptions};

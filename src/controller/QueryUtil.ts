import {InsightError} from "./IInsightFacade";
import {wildcardStartFilter, wildcardEndFilter, wildcardIncludeFilter} from "./WildcardUtil";

function filterData(data: any[], query: any): any[] {
	const queryString: string = Object.keys(query)[0];
	let removeData: any[];

	switch(queryString) {
		case "LT":
			data = filterMComparator(data, "LT", Object.keys(query.LT)[0], query.LT[Object.keys(query.LT)[0]]);
			break;
		case "GT":
			data = filterMComparator(data, "GT", Object.keys(query.GT)[0], query.GT[Object.keys(query.GT)[0]]);
			break;
		case "EQ":
			data = filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query.EQ[Object.keys(query.EQ)[0]]);
			break;
		case "AND":
			data = filterAND(data, query.AND);
			break;
		case "OR":
			data = filterOR(data, query.OR);
			break;
		case "IS":
			data = filterSComparator(data, Object.keys(query.IS)[0], query.IS[Object.keys(query.IS)[0]]);
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
	let resultSet = new Set();

	for (let query of queryArray) {
		queryResults.push(filterData(data, query));
	}
	/*
	if (queryResults.length > 1) {
		for (let idx = 1; idx < queryResults.length; idx++) {
			for (let x = 0; x < queryResults[idx].length; x++) {
				if (!queryResults[0].includes(queryResults[idx][x])) {
					queryResults[0].push(queryResults[idx][x]);
				}
			}
		}
	}

	return queryResults[0];
*/

	for (let datasetItem of queryResults) {
		for (let item of datasetItem) {
			resultSet.add(item);
		}
	}

	let result = [...resultSet];

	return result;

}

function filterMComparator(data: any[], comparator: string, field: string, value: number): any[] {
	let filteredData: any[] = [];
	let dataYear: number;
	const dataKey: string = getDataKey(field.split("_")[1]);

	switch(comparator) {
		case "LT":
			filteredData = data.filter((dataClass) => {
				dataYear = checkIsOverall(dataClass);
				if (dataYear === 1900) {
					dataClass.Year = 1900;
				}

				return dataClass[dataKey] < value;
			});
			break;
		case "GT":
			filteredData = data.filter((dataClass) => {
				dataYear = checkIsOverall(dataClass);
				if (dataYear === 1900) {
					dataClass.Year = 1900;
				}

				return dataClass[dataKey] > value;
			});
			break;
		case "EQ":
			filteredData = data.filter((dataClass) => {
				dataYear = checkIsOverall(dataClass);
				if (dataYear === 1900) {
					dataClass.Year = 1900;
				}

				return dataClass[dataKey] === value;

			});
			break;
	}

	return filteredData;
}


function checkIsOverall(dataObject: any): number {
	if (dataObject.Section === "overall") {
		return 1900;
	} else {
		return dataObject["Year"];
	}
}

function filterOptions(data: any[], query: any): any[] {
	const dataColumns: string[] = query.COLUMNS;
	const sortColumn: string = query.ORDER;
	let filteredData: any[] = [];

	for (let section = 0; section < data.length; section++) {
		if (typeof data[section] !== "object") {
			continue;
		}

		filteredData.push({});

		for (let key of dataColumns) {
			let dataKey: string = getDataKey(key.split("_")[1]);
			switch (dataKey) {
				case "id":
					filteredData[section][key] = data[section][dataKey].toString();
					break;
				case "Year":
					filteredData[section][key] = parseInt(data[section][dataKey], 10);
					break;
				default: filteredData[section][key] = data[section][dataKey];
			}
		}
	}

	filteredData.sort((a,b) => {
		return a[sortColumn] >= b[sortColumn] ? 1 : -1;
	});

	return filteredData;
}

function filterSComparator(data: any[], field: string, value: string) {
	let filteredData: any[];
	let dataKey: string = getDataKey(field.split("_")[1]);
	let dataYear: number;

	if (!value.includes("*")) {
		filteredData = data.filter((dataClass) => {
			dataYear = checkIsOverall(dataClass);
			if (dataYear === 1900) {
				dataClass.Year = 1900;
			}

			return dataClass[dataKey] === value;
		});
	} else {
		filteredData = filterWildcardString(data, dataKey, value);
	}

	return filteredData;
}

function filterWildcardString(data: any[], dataKey: string, wildcardString: string) {
	let indices: number[] = [];
	let splitString: string[] = wildcardString.split("*");
	let dataYear: number;

	for (let i = 0; i < wildcardString.length; i++) {
		if (wildcardString[i] === "*") {
			indices.push(i);
		}
	}

	if (wildcardString.length === 1) {
		return data;
	}

	if (indices.length === 1) {
		switch (indices[0]) {
			case 0:
				data = wildcardStartFilter(data, dataKey, splitString);
				break;
			case wildcardString.length - 1:
				data = wildcardEndFilter(data, dataKey, splitString);
				break;
			default: throw new InsightError("wildcard must be in beginning or end of string");
		}
	} else {
		data = wildcardIncludeFilter(data, indices, dataKey, wildcardString);
	}

	return data;
}

function getDataKey(key: string) {
	let dataKey: string;

	switch (key) {
		case "dept":
			dataKey = "Subject";
			break;
		case "id":
			dataKey = "Course";
			break;
		case "avg":
			dataKey = "Avg";
			break;
		case "instructor":
			dataKey = "Professor";
			break;
		case "title":
			dataKey = "Title";
			break;
		case "pass":
			dataKey = "Pass";
			break;
		case "fail":
			dataKey = "Fail";
			break;
		case "audit":
			dataKey = "Audit";
			break;
		case "uuid":
			dataKey = "id";
			break;
		case "year":
			dataKey = "Year";
			break;
		default: throw new InsightError();
	}

	return dataKey;
}

export {filterData, filterOptions, checkIsOverall};

import {InsightError} from "./IInsightFacade";

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
	let results: any[] = [];

	for (let query of queryArray) {
		queryResults.push(filterData(data, query));
	}

	for (let datasetItem of queryResults) {
		results = results.concat(datasetItem);
	}

	results = results.filter((item, index, self) => {
		return index === self.findIndex((t) => {
			return t.Title === item.Title && t.Subject === item.Subject && t.id === item.id && t.Avg === item.Avg &&
			t.Professor === item.Professor && t.Pass === item.Pass && t.Fail === item.Fail && t.Audit === item.Audit &&
			t.Section === item.Section && t.Year === item.Year;
		});
	});

	return results;
}

function filterMComparator(data: any[], comparator: string, field: string, value: number): any[] {
	let filteredData: any[] = [];
	const dataKey: string = getDataKey(field.split("_")[1]);

	switch(comparator) {
		case "LT":
			filteredData = data.filter((dataClass) => {
				if (dataKey === "Year") {
					return checkIsOverall(dataClass) < value;
				} else {
					return dataClass[dataKey] < value;
				}
			});
			break;
		case "GT":
			filteredData = data.filter((dataClass) => {
				if (dataKey === "Year") {
					return checkIsOverall(dataClass) > value;
				} else {
					return dataClass[dataKey] > value;
				}
			});
			break;
		case "EQ":
			filteredData = data.filter((dataClass) => {
				if (dataKey === "Year") {
					return checkIsOverall(dataClass) === value;
				} else {
					return dataClass[dataKey] === value;
				}
			});
			break;
	}
	/*
	console.log(filteredData, "filter M");
	console.log(field, "field");
	console.log(value, "value");
	*/
	return filteredData;
}

function checkIsOverall(dataObject: any): number {
	// console.log(dataObject, "dataObject");
	if (dataObject.Section === "overall") {
		// console.log("is overall!");
		return 1900;
	} else {
		return dataObject["Year"];
	}
}

function filterOptions(data: any[], query: any): any[] {
	const dataColumns: string[] = query.COLUMNS;
	const sortColumn: string = query.ORDER;
	const sort: string = query.ORDER.split("_")[1];
	let filteredData: any[] = [];

	for (let section = 0; section < data.length; section++) {
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
			/*
			if (dataKey === "id") {
				filteredData[section][key] = data[section][dataKey].toString();
			} else {
				filteredData[section][key] = data[section][dataKey];
			}
			*/
		}
	}
	/*
	if (typeof filteredData[0][sortColumn] === "number") {
		filteredData.sort((a,b) => {
			return a[sortColumn] > b[sortColumn] ? 1 : -1;
		});
	} else {

	}
	*/
	filteredData.sort((a,b) => {
		return a[sortColumn] > b[sortColumn] ? 1 : -1;
	});
	// console.log(filteredData, "sorted data");
	return filteredData;
}

function filterSComparator(data: any[], field: string, value: string) {
	/*
	if (field !== "dept" && field !== "id" && field !== "instructor" && field !== "title" && field !== "uuid") {
		throw new InsightError();
	}
	*/
	let filteredData: any[];
	let dataKey: string = getDataKey(field.split("_")[1]);

	filteredData = data.filter((dataClass) => {
		return dataClass[dataKey] === value;
	});
	/*
	if (!value.includes("*")) {
		filteredData = data.filter((dataClass) => {
			return dataClass[dataKey] === value;
		});
	} else {

		console.log(data.length, "before filter");
		let replaceThis = "John";
		let re = new RegExp(`\\b${replaceThis}\\b`, "gi");

		"mystring1".replace(re, "newstring");
		console.log(re, "re");
		filteredData = data.filter((dataClass) => {
			let regex = /^.*sc/;
			return /^.*sc/.test(dataClass[dataKey]);
		});
		console.log(filteredData.length, "after filter");

	}
	*/
	return filteredData;
}
/*
function checkValidWildcardString() {
	return;
}

function checkWildcardString() {
	return;
}
*/
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


export {filterData, filterOptions};

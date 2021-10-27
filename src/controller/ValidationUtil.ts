import {InsightError} from "./IInsightFacade";

function checkValidQuery(query: any): string {
	const where: Record<string, any> = query.WHERE;
	const options: Record<string, any> = query.OPTIONS;

	let id: string = checkValidOptions(options);

	if (Object.keys(where).length !== 0) {
		checkValidWhere(where, id);
	}

	return id;
}

function checkValidWhere(query: any, id: string) {
	const queryString: string = Object.keys(query)[0];

	if (Object.keys(query).length !== 1) {
		throw new InsightError();
	}

	switch(queryString) {
		case "LT":
			checkValidMComparator(query.LT, id);
			break;
		case "GT":
			checkValidMComparator(query.GT, id);
			break;
		case "EQ":
			checkValidMComparator(query.EQ, id);
			break;
		case "AND":
			checkValidLogicalComparator(query.AND, id);
			break;
		case "OR":
			checkValidLogicalComparator(query.OR, id);
			break;
		case "IS":
			checkValidSComparator(query.IS, id);
			break;
		case "NOT":
			checkValidNOTComparator(query.NOT, id);
			break;
		default: throw new InsightError();
	}
}

function checkValidMComparator(query: any, id: string): void {
	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError();
	}

	if (Object.keys(query)[0].split("_")[0] !== id) {
		throw new InsightError();
	}

	if (typeof query[Object.keys(query)[0]] !== "number") {
		throw new InsightError();
	}
}

function checkValidLogicalComparator(query: any, id: string) {
	if (!Array.isArray(query)) {
		throw new InsightError();
	}

	if (query.length === 0) {
		throw new InsightError();
	}

	query.forEach((q: any) => {
		if (Object.keys(q).length === 0) {
			throw new InsightError();
		}

		checkValidWhere(q, id);
	});
}

function checkValidSComparator(query: any, id: string) {
	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError();
	}

	if (Object.keys(query)[0].split("_")[0] !== id) {
		throw new InsightError();
	}
}

function checkValidNOTComparator(query: any, id: string) {
	if (typeof query !== "object") {
		throw new InsightError();
	}

	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError();
	}

	checkValidWhere(query, id);
}

/*
function checkValidOptions(options: any, id: string) {
	let optionKeys: string[] = Object.keys(options);

	if (optionKeys.length >= 3) {
		throw new InsightError();
	}

	if (optionKeys.length === 2) {
		if (optionKeys.indexOf("COLUMNS") === -1 || optionKeys.indexOf("ORDER") === -1) {
			throw new InsightError();
		}
	} else {
		if (optionKeys.indexOf("COLUMNS") === -1) {
			throw new InsightError();
		}
	}

	const order: string = options.order;

	if (order) {
		if (order.split("_")[0] !== id) {
			throw new InsightError();
		}
	}
}
*/

function checkValidOptions(options: any) {
	let optionKeys: string[] = Object.keys(options);
	let columns: any[] = options.COLUMNS;
	let order: string = options.ORDER;
	let id: string;

	if (!Array.isArray(options.COLUMNS) || typeof options.ORDER !== "string") {
		throw new InsightError();
	}
	if (optionKeys.length > 2) {
		throw new InsightError();
	}

	if (optionKeys.length === 2) {
		if (optionKeys.indexOf("COLUMNS") === -1 || optionKeys.indexOf("ORDER") === -1) {
			throw new InsightError();
		}
	} else {
		if (optionKeys.indexOf("COLUMNS") === -1) {
			throw new InsightError();
		}
	}
	if (typeof columns[0] !== "string" || columns[0].split("_").length > 2) {
		throw new InsightError();
	}

	id = columns[0].split("_")[0];

	if (id.length === 0) {
		throw new InsightError();
	}

	columns.forEach((c) => {
		if (typeof c !== "string" || id !== c.split("_")[0]) {
			throw new InsightError();
		}

		checkValidKey(c.split("_")[1]);
	});

	if (order) {
		if (id !== order.split("_")[0]) {
			throw new InsightError();
		}

		checkValidKey(order.split("_")[1]);
	}

	return id;
}

function checkValidKey(key: string): void {
	const validKeys: string[] = ["avg", "pass", "fail", "audit", "year",
		"dept", "id", "instructor", "title", "uuid"];

	if (!validKeys.includes(key)) {
		throw new InsightError();
	}
}

export {checkValidQuery};

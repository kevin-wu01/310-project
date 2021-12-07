import {InsightError} from "../IInsightFacade";
import {checkValidTransformations} from "./ValidTransformUtil";
import {checkValidKey, checkValidRoomKey} from "./DatasetKeyUtil";

function checkValidQuery(query: any, type: string): string {
	const where: Record<string, any> = query.WHERE;
	const options: Record<string, any> = query.OPTIONS;
	const transformations: Record<string, any> = query.TRANSFORMATIONS;
	let customKeys: string[] = [];
	let id: string;

	Object.keys(query).forEach((key) => {
		const validKeys: string[] = ["WHERE", "OPTIONS", "TRANSFORMATIONS"];
		if (!validKeys.includes(key)) {
			throw new InsightError("invalid query body");
		}
	});

	if (Object.keys(options).length === 0 || !Object.keys(options).includes("COLUMNS")) {
		throw new InsightError("Invalid options");
	}

	if (!Array.isArray(options.COLUMNS)) {
		throw new InsightError("Invalid columns");
	}

	// let id: string = getQueryId(options.COLUMNS, transformations);

	{
		if (transformations) {
			if (Object.keys(transformations).length !== 2) {
				throw new InsightError("Transformation missing keys");
			}

			if (transformations.GROUP.length === 0) {
				throw new InsightError("Group must be non-empty array");
			}

			id = getQueryId(transformations.GROUP);
			customKeys = checkValidTransformations(transformations, id, type);
		} else {
			id = getQueryId(options.COLUMNS);
		}
	}

	checkValidOptions(options, customKeys, id);

	if (Object.keys(where).length !== 0) {
		checkValidWhere(where, id, type);
	}

	return id;
}

function getQueryId(columns: string[]) {
	let id: string = columns[0].split("_")[0];

	if (id.length === 0) {
		throw new InsightError("Invalid format");
	}

	return id;
}

function checkValidWhere(query: any, id: string, type: string) {
	const queryString: string = Object.keys(query)[0];

	if (Object.keys(query).length !== 1) {
		throw new InsightError("Invalid format");
	}

	switch(queryString) {
		case "LT":
			checkValidMComparator(query.LT, id, type);
			break;
		case "GT":
			checkValidMComparator(query.GT, id, type);
			break;
		case "EQ":
			checkValidMComparator(query.EQ, id, type);
			break;
		case "AND":
			checkValidLogicalComparator(query.AND, id, type);
			break;
		case "OR":
			checkValidLogicalComparator(query.OR, id, type);
			break;
		case "IS":
			checkValidSComparator(query.IS, id, type);
			break;
		case "NOT":
			checkValidNOTComparator(query.NOT, id, type);
			break;
		default: throw new InsightError("Invalid format");
	}
}

function checkValidMComparator(query: any, id: string, type: string): void {
	if (typeof query !== "object") {
		throw new InsightError("Invalid format");
	}

	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError("Invalid format");
	}

	if (Object.keys(query)[0].split("_")[0] !== id) {
		throw new InsightError("Invalid format");
	}

	if (typeof query[Object.keys(query)[0]] !== "number") {
		throw new InsightError("Invalid format");
	}
	/*
	if (type === "courses") {
		checkValidKey(Object.keys(query)[0].split("_")[1], true);
	} else {
		checkValidRoomKey(Object.keys(query)[0].split("_")[1], true);
	}
	*/
}

function checkValidLogicalComparator(query: any, id: string, type: string) {
	if (!Array.isArray(query)) {
		throw new InsightError("Invalid format");
	}

	if (query.length === 0) {
		throw new InsightError("Invalid format");
	}

	query.forEach((q: any) => {
		if (Object.keys(q).length === 0) {
			throw new InsightError("Invalid format");
		}

		checkValidWhere(q, id, type);
	});
}

function checkValidSComparator(query: any, id: string, type: string) {
	if (typeof query !== "object" || 11 > 12) {
		throw new InsightError("Invalid format");
	}

	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError("Invalid format");
	}

	if (Object.keys(query)[0].split("_")[0] !== id) {
		throw new InsightError("Invalid format");
	}

	if (typeof query[Object.keys(query)[0]] !== "string") {
		throw new InsightError("Invalid format");
	}

	if (query[Object.keys(query)[0]].includes("*")) {
		checkValidWildcardString(query[Object.keys(query)[0]]);
	}
	/*
	if (type === "courses") {
		console.log(Object.keys(query)[0].split("_")[1]);
		checkValidKey(Object.keys(query)[0].split("_")[1], false, [], true);
	} else {
		checkValidRoomKey(Object.keys(query)[0].split("_")[1], false, [], true);
	}
	*/
}

function checkValidWildcardString(wildcard: string) {
	const wildcardArray: string[] = wildcard.split("*");

	if (wildcardArray.length > 3) {
		throw new InsightError("Invalid wildcard");
	}

	if (wildcardArray.length === 3) {
		if (!(wildcard.startsWith("*") && wildcard.endsWith("*"))) {
			throw new InsightError("Invalid wildcard");
		}
	} else {
		if (!(wildcard.startsWith("*") || wildcard.endsWith("*"))) {
			throw new InsightError("Invalid wildcard");
		}
	}
}

function checkValidNOTComparator(query: any, id: string, type: string) {
	if (typeof query !== "object") {
		throw new InsightError("Invalid format");
	}

	if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
		throw new InsightError("Invalid format");
	}

	checkValidWhere(query, id, type);
}

function checkValidOptions(options: any, customKeys: string[], id: string) {
	let optionKeys: string[] = Object.keys(options);
	let columns: any[] = options.COLUMNS;
	let order: string = options.ORDER;

	if (!Array.isArray(options.COLUMNS)) {
		throw new InsightError("Invalid format");
	}
	if (optionKeys.length > 2) {
		throw new InsightError("Invalid format");
	}
	if (optionKeys.length === 2) {
		if (optionKeys.indexOf("COLUMNS") === -1 || optionKeys.indexOf("ORDER") === -1) {
			throw new InsightError("Invalid format");
		}
	} else {
		if (optionKeys.indexOf("COLUMNS") === -1) {
			throw new InsightError("Invalid format");
		}
	}
	if (typeof columns[0] !== "string" || columns[0].split("_").length > 2) {
		throw new InsightError("Invalid format");
	}
	if (customKeys.length !== 0) {
		columns.forEach((c) => {
			if (!customKeys.includes(c)) {
				throw new InsightError("column and transformation arrays different");
			}
		});
	} else {
		columns.forEach((c) => {
			if (typeof c !== "string" || id !== c.split("_")[0]) {
				throw new InsightError("Invalid format");
			}

			checkValidKey(c, false);
		});
	}
	if (order) {
		checkValidOrder(order, columns, id);
	}
	return id;
}

function checkValidOrder(order: any, columns: string[], id: string) {
	if (typeof order !== "string" && typeof order !== "object") {
		throw new InsightError("Invalid order format");
	}

	if (typeof order === "string") {
		if (!columns.includes(order)) {
			throw new InsightError("order key must be in columns");
		}
	} else {
		const orderKeys: string[] = Object.keys(order);

		if (orderKeys.length !== 2) {
			throw new InsightError("two keys required in order");
		}

		if (!orderKeys.includes("dir") || !orderKeys.includes("keys")) {
			throw new InsightError("invalid keys in order");
		}

		if (order.dir !== "DOWN" && order.dir !== "UP") {
			throw new InsightError("invalid order direction");
		}

		if (!Array.isArray(order.keys) || order.keys.length === 0) {
			throw new InsightError("order keys must be array of size greater than 0");
		}

		for (let key of order.keys) {
			if (!columns.includes(key)) {
				throw new InsightError("invalid order key");
			}
		}
	}
}

export {checkValidQuery, checkValidKey, checkValidRoomKey};

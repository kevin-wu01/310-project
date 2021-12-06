import {InsightError} from "../IInsightFacade";

function getQueryId(query: any) {
	const options = query.OPTIONS;
	const transformations = query.TRANSFORMATIONS;
	let id: string;

	if (typeof options !== "object" || !Object.keys(options).includes("COLUMNS")) {
		throw new InsightError("invalid options object");
	}

	if (!Array.isArray(options.COLUMNS)) {
		throw new InsightError("invalid columns");
	}

	if (transformations) {
		const group = transformations.GROUP;

		if (!Array.isArray(group) || Object.keys(group).length === 0) {
			throw new InsightError("invalid group");
		}

		id = group[0].split("_")[0];
	} else {
		const columns = options.COLUMNS;

		if (columns.length === 0) {
			throw new InsightError("columns array cannot be empty");
		}

		id = columns[0].split("_")[0];
	}

	return id;
}

function checkValidKey(key: string, numOnly: boolean = false, customKeys: string[] = [], SOnly: boolean = false): void {
	const validKeys: string[] = ["avg", "pass", "fail", "audit", "year",
		"dept", "id", "instructor", "title", "uuid"];
	const numericKeys: string[] = ["avg", "pass", "fail", "audit", "year"];
	const stringKeys: string[] = ["dept", "id", "instructor", "title", "uuid"];
	const splitKey = key.split("_")[1];

	if (numOnly) {
		if (!numericKeys.includes(splitKey)) {
			throw new InsightError("Invalid key");
		}
	} else {
		/*
		if (SOnly) {
			if (!stringKeys.includes(splitKey)) {
				throw new InsightError("Invalid key");
			}
		} else {
			if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
				throw new InsightError("Invalid key");
			}
		}
		*/
		// console.log(validKeys.includes(splitKey));
		if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
			throw new InsightError("Invalid key");
		}
	}
}

function checkValidRoomKey(key: string, numOnly: boolean = false, customKeys: string[] = [],
	SOnly: boolean = false): void {
	const validKeys: string[] = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type",
		"furniture", "href"];
	const numericKeys: string[] = ["lat", "lon", "seats"];
	const stringKeys: string[] = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
	const splitKey = key.split("_")[1];

	if (numOnly) {
		if (!numericKeys.includes(splitKey)) {
			throw new InsightError("Invalid key");
		}
	} else {
		/*
		if (SOnly) {
			if (!stringKeys.includes(splitKey)) {
				throw new InsightError("Invalid key");
			}
		} else {
			if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
				throw new InsightError("Invalid key");
			}
		}
		*/
		if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
			throw new InsightError("Invalid key");
		}
	}
}

export {getQueryId, checkValidRoomKey, checkValidKey};

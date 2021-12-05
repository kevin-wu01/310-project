import {Query} from "./TestUtil";

const query1 = {
	WHERE: {},
	OPTIONS: {
		COLUMNS: [
			"courses_title",
			"overallAvg"
		]
	},
	TRANSFORMATIONS: {
		GROUP: [
			"courses_title"
		],
		APPLY: [
			{
				overallAvg: {
					AVG: "courses_avg"
				}
			}
		]
	}
};

const query2 = {
	WHERE: {},
	OPTIONS: {
		COLUMNS: [
			"courses_title",
			"overallAvg"
		],
		ORDER: "overallAvg"
	},
	TRANSFORMATIONS: {
		GROUP: [
			"courses_title"
		],
		APPLY: [
			{
				overallAvg: {
					SUM: "courses_audit"
				}
			}
		]
	}
};

const resultObject1 = [{}];

const resultObject2 = [{}];

function getWeirdQuery(): Query {
	let query: Record<string, any>;
	query = query1;

	return({query, path: "courses.zip", resultObject: resultObject1});
}

function getOrderQuery(): Query {
	let query: Record<string, any>;
	query = query2;

	return ({query, path: "courses.zip", resultObject: resultObject2});
}

export {getWeirdQuery, getOrderQuery};

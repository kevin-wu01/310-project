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

const resultObject1 = [{}];

function getWeirdQuery(): Query {
	let query: Record<string, any>;
	query = query1;
	let resultObject = resultObject1;

	return({query, path: "courses.zip", resultObject: resultObject1});
}

export {getWeirdQuery};

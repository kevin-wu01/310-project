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

const resultObject1 = [{courses_dept:"edcp",maxAvg:95.58},{courses_dept:"cpsc",maxAvg:95}];

function getWeirdQuery(): Query {
	let query: Record<string, any>;
	query = query1;
	let resultObject = resultObject1;

	return({query, path: "courses.zip", resultObject: resultObject1});
}

export {getWeirdQuery};

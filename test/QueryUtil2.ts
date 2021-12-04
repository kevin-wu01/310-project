import {Query} from "./TestUtil";

const query1 = {

};

const resultObject1 = [{}];

function getWeirdQuery(): Query {
	let query: Record<string, any>;
	query = query1;
	let resultObject = resultObject1;

	return({query, path: "courses.zip", resultObject: resultObject1});
}

export {getWeirdQuery};

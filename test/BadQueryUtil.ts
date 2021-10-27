import {Query} from "./TestUtil";

function getBadIDQuery(): Query {
	let query: Record<string, any>;

	query = {
		WHERE:{
			GT:{
				foobar:97
			}
		},
		OPTIONS:{
			COLUMNS:[
				"courses_dept",
				"courses_avg"
			],
			ORDER:"courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: []});
}

function getTwoDatasets(): Query {
	let query: Record<string, any>;

	query = {
		WHERE:{
			AND: [
				{
					GT:{
						courses_avg:97
					}
				},
				{
					GT: {
						ct_avg: 90
					}
				}
			]
		},
		OPTIONS:{
			COLUMNS:[
				"courses_dept",
				"courses_avg"
			],
			ORDER:"courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: []});

}

export {getBadIDQuery, getTwoDatasets};

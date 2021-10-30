import {Query} from "./TestUtil";

const resultObject1 = [{courses_dept:"micb",courses_avg:67.66,courses_audit:5,
	courses_pass:166,courses_fail:26,courses_year:2011,courses_uuid:"17473",courses_instructor:"kion, tracy",
	courses_title:"immunology",courses_id:"302"},{courses_dept:"comm",courses_avg:71.13,courses_audit:4,
	courses_pass:223,courses_fail:14,courses_year:2011,courses_uuid:"709",courses_instructor:"graham, brian",
	courses_title:"int quan dec mak",courses_id:"290"},{courses_dept:"econ",courses_avg:67.26,courses_audit:6,
	courses_pass:117,courses_fail:13,courses_year:2013,courses_uuid:"90960",
	courses_instructor:"newman, geoffrey",courses_title:"money & banking",courses_id:"345"}];

const resultObject2 = [{courses_dept:"apsc",courses_avg:95.05},{courses_dept:"musc",courses_avg:95.38},
	{courses_dept:"musc",courses_avg:95.67},{courses_dept:"apsc",courses_avg:95.94},
	{courses_dept:"apsc",courses_avg:95.95},{courses_dept:"apsc",courses_avg:96},
	{courses_dept:"musc",courses_avg:96.5},{courses_dept:"musc",courses_avg:96.5}];

function getGTQuery(): Query {
	let query: Record<string, any>;
	query = {
		WHERE: {
			AND: [
				{
					GT: {
						courses_avg: 40
					}
				},
				{
					GT: {
						courses_audit: 3
					}
				},
				{
					GT: {
						courses_pass: 50
					}
				},
				{
					GT: {
						courses_fail: 10
					}
				},
				{
					GT: {
						courses_year: 2010
					}
				}
			]
		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_avg",
				"courses_audit",
				"courses_pass",
				"courses_fail",
				"courses_year",
				"courses_uuid",
				"courses_instructor",
				"courses_title",
				"courses_id"
			],
			ORDER: "courses_year"
		}
	};
	return ({query, path: "courses.zip", resultObject: resultObject1});
}

function getWildcardQuery(): Query {
	let query: Record<string, any>;

	query = {
		WHERE: {
			AND: [
				{
					IS: {
						courses_dept: "*sc"
					}
				},
				{
					GT: {
						courses_avg: 95
					}
				}
			]
		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_avg"
			],
			ORDER: "courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: resultObject2});
}

export {getGTQuery, getWildcardQuery};

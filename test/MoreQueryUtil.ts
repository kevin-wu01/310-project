import {Query} from "./TestUtil";

const resultObject1 = [{courses_dept:"hist",courses_avg:34,courses_audit:0,courses_pass:1,courses_fail:1,
	courses_year:2009,courses_uuid:"14375",courses_instructor:"gossen, david",courses_title:"hist 1500 - 20 c",
	courses_id:"102"},{courses_dept:"busi",courses_avg:4,courses_audit:0,courses_pass:0,courses_fail:1,
	courses_year:1900,courses_uuid:"16428",courses_instructor:"",courses_title:"found re apprai",
	courses_id:"330"},{courses_dept:"wood",courses_avg:1,courses_audit:0,courses_pass:0,courses_fail:2,
	courses_year:1900,courses_uuid:"49835",courses_instructor:"",courses_title:"prpty,ident&uses",
	courses_id:"475"},{courses_dept:"phil",courses_avg:33.2,courses_audit:0,courses_pass:5,courses_fail:5,
	courses_year:2008,courses_uuid:"51675",courses_instructor:"",courses_title:"log & crit think",
	courses_id:"120"},{courses_dept:"lfs",courses_avg:0,courses_audit:0,courses_pass:0,courses_fail:1,
	courses_year:2009,courses_uuid:"56402",courses_instructor:"",courses_title:"in land food com",
	courses_id:"100"},{courses_dept:"lfs",courses_avg:0,courses_audit:0,courses_pass:0,courses_fail:1,
	courses_year:1900,courses_uuid:"56403",courses_instructor:"",courses_title:"in land food com",
	courses_id:"100"},{courses_dept:"frst",courses_avg:0,courses_audit:0,courses_pass:0,courses_fail:1,
	courses_year:1900,courses_uuid:"89536",courses_instructor:"",courses_title:"forest ecology",
	courses_id:"202"}];

const resultObject2 = [{courses_dept:"apsc",courses_avg:95.05},{courses_dept:"musc",courses_avg:95.38},
	{courses_dept:"musc",courses_avg:95.67},{courses_dept:"apsc",courses_avg:95.94},
	{courses_dept:"apsc",courses_avg:95.95},{courses_dept:"apsc",courses_avg:96},
	{courses_dept:"musc",courses_avg:96.5},{courses_dept:"musc",courses_avg:96.5}];

const resultObject3 = [{courses_dept:"busi",courses_avg:4},{courses_dept:"chem",courses_avg:53}];

function getGTQuery(): Query {
	let query: Record<string, any>;

	query = {
		WHERE: {

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
			ORDER: "courses_uuid"
		}
	};

	/*
	query = {
		WHERE: {
			AND: [
				{
					AND: [
						{
							LT: {
								courses_avg: 20
							}
						},
						{
							LT: {
								courses_avg: 50
							}
						}
					]
				},
				{
					LT: {
						courses_avg: 10
					}
				}
			]
		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_audit",
				"courses_avg"
			],
			ORDER: "courses_avg"
		}
	};
	*/
	/*

	/*
	query = {
            		WHERE: {
            				OR: [
            					{
            						LT: {
            							courses_fail: 0
            						}
            					},
            					{
            						GT: {
            							courses_pass: 2000
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
            	*/
	return ({query, path: "courses.zip", resultObject: resultObject1});
}

function getWildcardQuery(): Query {
	let query: Record<string, any>;

	query = {
		WHERE: {
			OR: [
				{
					IS: {
						courses_dept: "*cpsc*"
					}
				}
			]
		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_avg",
			],
			ORDER: "courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: resultObject2});
}

export {getGTQuery, getWildcardQuery};

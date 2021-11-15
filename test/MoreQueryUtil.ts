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
/*
const resultObject2 = [{courses_dept:"apsc",courses_avg:95.05},{courses_dept:"musc",courses_avg:95.38},
	{courses_dept:"musc",courses_avg:95.67},{courses_dept:"apsc",courses_avg:95.94},
	{courses_dept:"apsc",courses_avg:95.95},{courses_dept:"apsc",courses_avg:96},
	{courses_dept:"musc",courses_avg:96.5},{courses_dept:"musc",courses_avg:96.5}];
*/

const resultObject2 = [{courses_dept:"eosc",courses_avg:72.46,courses_pass:2016},
	{courses_dept:"eosc",courses_avg:73.39,courses_pass:2015}];

const resultObject3 = [{courses_dept:"busi",courses_avg:4},{courses_dept:"chem",courses_avg:53}];

const resultObject4 = [{courses_dept:"lfs",courses_avg:0,courses_pass:0},{courses_dept:"lfs",courses_avg:0,courses_pass:0},{courses_dept:"econ",courses_avg:66.86,courses_pass:2063},{courses_dept:"econ",courses_avg:67.24,courses_pass:2124},{courses_dept:"econ",courses_avg:68.27,courses_pass:2169},{courses_dept:"econ",courses_avg:68.4,courses_pass:2378},{courses_dept:"econ",courses_avg:68.41,courses_pass:2023},{courses_dept:"psyc",courses_avg:68.41,courses_pass:1966},{courses_dept:"econ",courses_avg:68.48,courses_pass:1962},{courses_dept:"econ",courses_avg:68.72,courses_pass:2134},{courses_dept:"econ",courses_avg:68.75,courses_pass:2286},{courses_dept:"econ",courses_avg:68.98,courses_pass:2019},{courses_dept:"psyc",courses_avg:69.14,courses_pass:2201},{courses_dept:"psyc",courses_avg:69.15,courses_pass:1953},{courses_dept:"econ",courses_avg:69.25,courses_pass:2278},{courses_dept:"econ",courses_avg:69.43,courses_pass:2099},{courses_dept:"psyc",courses_avg:69.45,courses_pass:2095},{courses_dept:"econ",courses_avg:69.5,courses_pass:2083},{courses_dept:"psyc",courses_avg:69.51,courses_pass:2289},{courses_dept:"econ",courses_avg:69.82,courses_pass:2438},{courses_dept:"lfs",courses_avg:69.96,courses_pass:47},{courses_dept:"econ",courses_avg:70.08,courses_pass:1948},{courses_dept:"lfs",courses_avg:71.13,courses_pass:26},{courses_dept:"lfs",courses_avg:71.13,courses_pass:26},{courses_dept:"lfs",courses_avg:71.22,courses_pass:183},{courses_dept:"lfs",courses_avg:71.22,courses_pass:183},{courses_dept:"lfs",courses_avg:71.4,courses_pass:9},{courses_dept:"engl",courses_avg:71.49,courses_pass:2466},{courses_dept:"engl",courses_avg:71.51,courses_pass:2502},{courses_dept:"engl",courses_avg:71.71,courses_pass:2557},{courses_dept:"engl",courses_avg:71.91,courses_pass:2994},{courses_dept:"lfs",courses_avg:71.93,courses_pass:26},{courses_dept:"engl",courses_avg:72.02,courses_pass:2491},{courses_dept:"lfs",courses_avg:72.08,courses_pass:24},{courses_dept:"engl",courses_avg:72.3,courses_pass:1948},{courses_dept:"eosc",courses_avg:72.46,courses_pass:2016},{courses_dept:"lfs",courses_avg:72.55,courses_pass:17},{courses_dept:"engl",courses_avg:72.59,courses_pass:2498},{courses_dept:"eosc",courses_avg:72.59,courses_pass:1950},{courses_dept:"engl",courses_avg:72.75,courses_pass:1990},{courses_dept:"lfs",courses_avg:72.8,courses_pass:88},{courses_dept:"lfs",courses_avg:72.84,courses_pass:327},{courses_dept:"engl",courses_avg:72.91,courses_pass:2698},{courses_dept:"lfs",courses_avg:72.97,courses_pass:27},{courses_dept:"lfs",courses_avg:73,courses_pass:28},{courses_dept:"lfs",courses_avg:73,courses_pass:28},{courses_dept:"lfs",courses_avg:73.14,courses_pass:183},{courses_dept:"engl",courses_avg:73.17,courses_pass:2655},{courses_dept:"lfs",courses_avg:73.18,courses_pass:28},{courses_dept:"lfs",courses_avg:73.36,courses_pass:280},{courses_dept:"eosc",courses_avg:73.39,courses_pass:2015},{courses_dept:"lfs",courses_avg:73.46,courses_pass:95},{courses_dept:"lfs",courses_avg:73.96,courses_pass:260},{courses_dept:"lfs",courses_avg:73.96,courses_pass:260},{courses_dept:"lfs",courses_avg:74.63,courses_pass:122},{courses_dept:"lfs",courses_avg:74.86,courses_pass:28},{courses_dept:"lfs",courses_avg:74.86,courses_pass:28},{courses_dept:"lfs",courses_avg:74.9,courses_pass:28},{courses_dept:"lfs",courses_avg:75.04,courses_pass:27},{courses_dept:"lfs",courses_avg:75.04,courses_pass:23},{courses_dept:"lfs",courses_avg:75.11,courses_pass:51},{courses_dept:"lfs",courses_avg:75.11,courses_pass:51},{courses_dept:"lfs",courses_avg:75.14,courses_pass:26},{courses_dept:"lfs",courses_avg:75.31,courses_pass:29},{courses_dept:"lfs",courses_avg:75.38,courses_pass:21},{courses_dept:"lfs",courses_avg:75.44,courses_pass:27},{courses_dept:"lfs",courses_avg:75.52,courses_pass:30},{courses_dept:"lfs",courses_avg:75.54,courses_pass:26},{courses_dept:"lfs",courses_avg:75.89,courses_pass:91},{courses_dept:"lfs",courses_avg:75.98,courses_pass:101},{courses_dept:"lfs",courses_avg:76.09,courses_pass:31},{courses_dept:"lfs",courses_avg:76.19,courses_pass:188},{courses_dept:"lfs",courses_avg:76.23,courses_pass:196},{courses_dept:"lfs",courses_avg:76.23,courses_pass:196},{courses_dept:"lfs",courses_avg:76.25,courses_pass:11},{courses_dept:"lfs",courses_avg:76.25,courses_pass:11},{courses_dept:"lfs",courses_avg:76.46,courses_pass:97},{courses_dept:"lfs",courses_avg:76.53,courses_pass:178},{courses_dept:"lfs",courses_avg:76.66,courses_pass:27},{courses_dept:"lfs",courses_avg:76.76,courses_pass:37},{courses_dept:"lfs",courses_avg:76.76,courses_pass:37},{courses_dept:"lfs",courses_avg:76.8,courses_pass:159},{courses_dept:"lfs",courses_avg:76.8,courses_pass:159},{courses_dept:"lfs",courses_avg:76.8,courses_pass:104},{courses_dept:"lfs",courses_avg:76.9,courses_pass:28},{courses_dept:"lfs",courses_avg:76.98,courses_pass:360},{courses_dept:"lfs",courses_avg:77.19,courses_pass:278},{courses_dept:"lfs",courses_avg:77.21,courses_pass:278},{courses_dept:"lfs",courses_avg:77.22,courses_pass:333},{courses_dept:"lfs",courses_avg:77.5,courses_pass:30},{courses_dept:"lfs",courses_avg:77.58,courses_pass:265},{courses_dept:"lfs",courses_avg:77.58,courses_pass:265},{courses_dept:"lfs",courses_avg:77.7,courses_pass:29},{courses_dept:"lfs",courses_avg:77.97,courses_pass:28},{courses_dept:"lfs",courses_avg:78.06,courses_pass:233},{courses_dept:"lfs",courses_avg:78.09,courses_pass:11},{courses_dept:"lfs",courses_avg:78.09,courses_pass:11},{courses_dept:"lfs",courses_avg:78.25,courses_pass:20},{courses_dept:"lfs",courses_avg:78.28,courses_pass:24},{courses_dept:"lfs",courses_avg:78.46,courses_pass:23},{courses_dept:"lfs",courses_avg:78.58,courses_pass:202},{courses_dept:"lfs",courses_avg:78.58,courses_pass:202},{courses_dept:"lfs",courses_avg:78.6,courses_pass:201},{courses_dept:"lfs",courses_avg:78.75,courses_pass:141},{courses_dept:"lfs",courses_avg:78.75,courses_pass:141},{courses_dept:"lfs",courses_avg:79,courses_pass:264},{courses_dept:"lfs",courses_avg:79.17,courses_pass:11},{courses_dept:"lfs",courses_avg:79.17,courses_pass:11},{courses_dept:"lfs",courses_avg:79.26,courses_pass:352},{courses_dept:"lfs",courses_avg:79.41,courses_pass:39},{courses_dept:"lfs",courses_avg:79.44,courses_pass:249},{courses_dept:"lfs",courses_avg:79.52,courses_pass:27},{courses_dept:"lfs",courses_avg:79.56,courses_pass:294},{courses_dept:"lfs",courses_avg:79.74,courses_pass:46},{courses_dept:"lfs",courses_avg:79.74,courses_pass:46},{courses_dept:"lfs",courses_avg:79.97,courses_pass:223},{courses_dept:"lfs",courses_avg:80.16,courses_pass:281},{courses_dept:"lfs",courses_avg:80.19,courses_pass:251},{courses_dept:"lfs",courses_avg:80.19,courses_pass:251},{courses_dept:"lfs",courses_avg:80.44,courses_pass:197},{courses_dept:"lfs",courses_avg:80.57,courses_pass:242},{courses_dept:"lfs",courses_avg:80.6,courses_pass:320},{courses_dept:"lfs",courses_avg:81.23,courses_pass:204},{courses_dept:"lfs",courses_avg:81.25,courses_pass:8},{courses_dept:"lfs",courses_avg:81.25,courses_pass:8},{courses_dept:"lfs",courses_avg:81.31,courses_pass:59},{courses_dept:"lfs",courses_avg:81.55,courses_pass:254},{courses_dept:"lfs",courses_avg:81.56,courses_pass:263},{courses_dept:"lfs",courses_avg:81.57,courses_pass:29},{courses_dept:"lfs",courses_avg:81.63,courses_pass:63},{courses_dept:"lfs",courses_avg:81.63,courses_pass:63},{courses_dept:"lfs",courses_avg:81.76,courses_pass:317},{courses_dept:"lfs",courses_avg:81.8,courses_pass:53},{courses_dept:"lfs",courses_avg:82,courses_pass:55},{courses_dept:"lfs",courses_avg:82.17,courses_pass:251},{courses_dept:"lfs",courses_avg:82.29,courses_pass:244},{courses_dept:"lfs",courses_avg:82.37,courses_pass:189},{courses_dept:"lfs",courses_avg:82.44,courses_pass:192},{courses_dept:"lfs",courses_avg:82.67,courses_pass:12},{courses_dept:"lfs",courses_avg:82.67,courses_pass:12},{courses_dept:"lfs",courses_avg:82.68,courses_pass:33},{courses_dept:"lfs",courses_avg:82.9,courses_pass:248},{courses_dept:"lfs",courses_avg:83.05,courses_pass:55},{courses_dept:"lfs",courses_avg:83.38,courses_pass:120},{courses_dept:"lfs",courses_avg:83.38,courses_pass:120},{courses_dept:"lfs",courses_avg:83.42,courses_pass:138},{courses_dept:"lfs",courses_avg:83.48,courses_pass:31},{courses_dept:"lfs",courses_avg:83.48,courses_pass:31},{courses_dept:"lfs",courses_avg:83.58,courses_pass:250},{courses_dept:"lfs",courses_avg:83.58,courses_pass:65},{courses_dept:"lfs",courses_avg:84.06,courses_pass:251},{courses_dept:"lfs",courses_avg:84.08,courses_pass:197},{courses_dept:"lfs",courses_avg:84.1,courses_pass:262},{courses_dept:"lfs",courses_avg:84.1,courses_pass:262},{courses_dept:"lfs",courses_avg:84.23,courses_pass:186},{courses_dept:"lfs",courses_avg:85.17,courses_pass:192},{courses_dept:"lfs",courses_avg:85.17,courses_pass:192},{courses_dept:"lfs",courses_avg:85.44,courses_pass:57},{courses_dept:"lfs",courses_avg:85.8,courses_pass:10},{courses_dept:"lfs",courses_avg:85.8,courses_pass:10},{courses_dept:"lfs",courses_avg:86.75,courses_pass:8},{courses_dept:"lfs",courses_avg:86.75,courses_pass:8},{courses_dept:"lfs",courses_avg:86.89,courses_pass:9},{courses_dept:"lfs",courses_avg:86.89,courses_pass:9},{courses_dept:"lfs",courses_avg:87,courses_pass:6},{courses_dept:"lfs",courses_avg:87,courses_pass:6},{courses_dept:"lfs",courses_avg:87.46,courses_pass:52},{courses_dept:"lfs",courses_avg:87.46,courses_pass:52},{courses_dept:"lfs",courses_avg:88.21,courses_pass:108},{courses_dept:"lfs",courses_avg:88.5,courses_pass:4},{courses_dept:"lfs",courses_avg:88.5,courses_pass:4},{courses_dept:"lfs",courses_avg:88.75,courses_pass:213},{courses_dept:"lfs",courses_avg:89.3,courses_pass:105},{courses_dept:"lfs",courses_avg:89.6,courses_pass:5},{courses_dept:"lfs",courses_avg:89.6,courses_pass:5},{courses_dept:"lfs",courses_avg:90.83,courses_pass:6},{courses_dept:"lfs",courses_avg:90.83,courses_pass:6}];
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
	query = {
		WHERE: {
			AND: [
				{
					LT: {
						courses_year: 1901
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
/*
	query = {
		WHERE: {
			NOT: {
				OR: [
					{
						LT: {
							courses_year: 2016
						}
					},
					{
						GT: {
							courses_pass: 2
						}
					}
				]
			}
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
	/*
	query = {
		WHERE: {

			OR: [{
				GT: {courses_avg: 99}
			},
			{
				LT: {courses_avg: 98}
			}
			]

		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_avg",
				"courses_uuid"
			],
			ORDER: "courses_avg"
		}
	};
	*/
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
			AND: [
				{
					IS: {
						courses_dept: "*sc*"
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
				"courses_avg",
				"courses_pass"
			],
			ORDER: "courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: resultObject2});
}

function getORQuery(): Query {
	let query: Record<string, any>;

	query = {
		WHERE: {
			OR: [
				{
					IS: {
						courses_dept: "*lf*"
					}
				},
				{
					GT: {
						courses_pass: 2000
					}
				},
				{
					GT: {
						courses_fail: 2000
					}
				},
				{
					OR: [
						{
							GT: {
								courses_pass: 1900
							}
						},
						{
							GT: {
								courses_fail: 2000
							}
						},
						{
							AND: [
								{
									GT: {
										courses_pass: 1900
									}
								},
								{
									GT: {
										courses_fail: 2000
									}
								}
							]
						}
					]
				}
			]
		},
		OPTIONS: {
			COLUMNS: [
				"courses_dept",
				"courses_avg",
				"courses_pass"
			],
			ORDER: "courses_avg"
		}
	};

	return ({query, path: "courses.zip", resultObject: resultObject4});
}

export {getGTQuery, getWildcardQuery, getORQuery};

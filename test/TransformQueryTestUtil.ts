import {Query} from "./TestUtil";

const query1 = {
	WHERE: {
		AND: [
			{
				IS: {
					courses_dept: "*cp*"
				}
			},
			{
				GT: {
					courses_avg: 90
				}
			}
		]
	},
	OPTIONS: {
		COLUMNS: [
			"courses_dept",
			"courses_avg",
			"maxAvg",
			"minAvg"
		],
		ORDER: {
			dir: "DOWN",
			keys: [
				"courses_avg",
				"minAvg"
			]
		}
	},
	TRANSFORMATIONS: {
		GROUP: [
			"courses_avg",
			"courses_dept"
		],
		APPLY: [
			{
				maxAvg: {
					MAX: "courses_avg"
				}
			},
			{
				minAvg: {
					AVG: "courses_year"
				}
			}
		]
	}
};

const resultObject1 = [{courses_dept:"edcp",courses_avg:95.58,maxAvg:95.58,minAvg:1956},
	{courses_dept:"cpsc",courses_avg:95,maxAvg:95,minAvg:1957},
	{courses_dept:"edcp",courses_avg:95,maxAvg:95,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:94.86,maxAvg:94.86,minAvg:1956.5},
	{courses_dept:"cpsc",courses_avg:94.5,maxAvg:94.5,minAvg:1953.5},
	{courses_dept:"edcp",courses_avg:94.17,maxAvg:94.17,minAvg:1955.5},
	{courses_dept:"cpsc",courses_avg:94,maxAvg:94,minAvg:1953.5},
	{courses_dept:"edcp",courses_avg:93.56,maxAvg:93.56,minAvg:2015},
	{courses_dept:"cpsc",courses_avg:93.5,maxAvg:93.5,minAvg:1955.5},
	{courses_dept:"cpsc",courses_avg:93.38,maxAvg:93.38,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:93.3,maxAvg:93.3,minAvg:1955},
	{courses_dept:"edcp",courses_avg:93.25,maxAvg:93.25,minAvg:2015},
	{courses_dept:"edcp",courses_avg:93.2,maxAvg:93.2,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:93.04,maxAvg:93.04,minAvg:2011},
	{courses_dept:"edcp",courses_avg:93,maxAvg:93,minAvg:1958},
	{courses_dept:"edcp",courses_avg:92.96,maxAvg:92.96,minAvg:2011},
	{courses_dept:"edcp",courses_avg:92.76,maxAvg:92.76,minAvg:2012},
	{courses_dept:"cpsc",courses_avg:92.75,maxAvg:92.75,minAvg:1956},
	{courses_dept:"edcp",courses_avg:92.64,maxAvg:92.64,minAvg:2014},
	{courses_dept:"edcp",courses_avg:92.63,maxAvg:92.63,minAvg:2014},
	{courses_dept:"cpsc",courses_avg:92.63,maxAvg:92.63,minAvg:1954.5},
	{courses_dept:"cpsc",courses_avg:92.5,maxAvg:92.5,minAvg:1956},
	{courses_dept:"edcp",courses_avg:92.45,maxAvg:92.45,minAvg:2010},
	{courses_dept:"cpsc",courses_avg:92.43,maxAvg:92.43,minAvg:1954.5},
	{courses_dept:"cpsc",courses_avg:92.4,maxAvg:92.4,minAvg:1957},
	{courses_dept:"edcp",courses_avg:92.33,maxAvg:92.33,minAvg:2010},
	{courses_dept:"edcp",courses_avg:92.2,maxAvg:92.2,minAvg:2015},
	{courses_dept:"edcp",courses_avg:92.14,maxAvg:92.14,minAvg:2011},
	{courses_dept:"edcp",courses_avg:92.06,maxAvg:92.06,minAvg:1900},
	{courses_dept:"edcp",courses_avg:92.05,maxAvg:92.05,minAvg:1900},
	{courses_dept:"edcp",courses_avg:92,maxAvg:92,minAvg:1956},
	{courses_dept:"cpsc",courses_avg:92,maxAvg:92,minAvg:1955},
	{courses_dept:"edcp",courses_avg:91.94,maxAvg:91.94,minAvg:2014},
	{courses_dept:"edcp",courses_avg:91.91,maxAvg:91.91,minAvg:2011},
	{courses_dept:"edcp",courses_avg:91.88,maxAvg:91.88,minAvg:1956},
	{courses_dept:"edcp",courses_avg:91.79,maxAvg:91.79,minAvg:2010},
	{courses_dept:"cpsc",courses_avg:91.79,maxAvg:91.79,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:91.78,maxAvg:91.78,minAvg:1958},
	{courses_dept:"edcp",courses_avg:91.72,maxAvg:91.72,minAvg:1955.5},
	{courses_dept:"edcp",courses_avg:91.63,maxAvg:91.63,minAvg:2014},
	{courses_dept:"edcp",courses_avg:91.5,maxAvg:91.5,minAvg:1975.33},
	{courses_dept:"edcp",courses_avg:91.48,maxAvg:91.48,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:91.47,maxAvg:91.47,minAvg:2012},
	{courses_dept:"edcp",courses_avg:91.44,maxAvg:91.44,minAvg:1957.5},
	{courses_dept:"edcp",courses_avg:91.43,maxAvg:91.43,minAvg:2011},
	{courses_dept:"edcp",courses_avg:91.39,maxAvg:91.39,minAvg:2012},
	{courses_dept:"edcp",courses_avg:91.37,maxAvg:91.37,minAvg:2013},
	{courses_dept:"edcp",courses_avg:91.36,maxAvg:91.36,minAvg:2010},
	{courses_dept:"edcp",courses_avg:91.27,maxAvg:91.27,minAvg:1955},
	{courses_dept:"edcp",courses_avg:91.25,maxAvg:91.25,minAvg:1956},
	{courses_dept:"cpsc",courses_avg:91.25,maxAvg:91.25,minAvg:1955.5},
	{courses_dept:"cpsc",courses_avg:91.22,maxAvg:91.22,minAvg:1957.25},
	{courses_dept:"edcp",courses_avg:91.11,maxAvg:91.11,minAvg:1900},
	{courses_dept:"cpsc",courses_avg:91,maxAvg:91,minAvg:1955},
	{courses_dept:"edcp",courses_avg:90.95,maxAvg:90.95,minAvg:2011},
	{courses_dept:"edcp",courses_avg:90.84,maxAvg:90.84,minAvg:2015},
	{courses_dept:"edcp",courses_avg:90.73,maxAvg:90.73,minAvg:2011},
	{courses_dept:"cpsc",courses_avg:90.71,maxAvg:90.71,minAvg:1956},
	{courses_dept:"edcp",courses_avg:90.67,maxAvg:90.67,minAvg:1955},
	{courses_dept:"edcp",courses_avg:90.64,maxAvg:90.64,minAvg:1956},
	{courses_dept:"cpsc",courses_avg:90.6,maxAvg:90.6,minAvg:1956.5},
	{courses_dept:"edcp",courses_avg:90.57,maxAvg:90.57,minAvg:1955.5},
	{courses_dept:"edcp",courses_avg:90.56,maxAvg:90.56,minAvg:1957.5},
	{courses_dept:"cpsc",courses_avg:90.53,maxAvg:90.53,minAvg:1957.5},
	{courses_dept:"edcp",courses_avg:90.52,maxAvg:90.52,minAvg:1957},
	{courses_dept:"edcp",courses_avg:90.47,maxAvg:90.47,minAvg:1900},
	{courses_dept:"edcp",courses_avg:90.46,maxAvg:90.46,minAvg:1900},
	{courses_dept:"edcp",courses_avg:90.35,maxAvg:90.35,minAvg:2010},
	{courses_dept:"edcp",courses_avg:90.33,maxAvg:90.33,minAvg:1957},
	{courses_dept:"edcp",courses_avg:90.28,maxAvg:90.28,minAvg:1900},
	{courses_dept:"cpsc",courses_avg:90.27,maxAvg:90.27,minAvg:2008},
	{courses_dept:"edcp",courses_avg:90.26,maxAvg:90.26,minAvg:1900},
	{courses_dept:"cpsc",courses_avg:90.25,maxAvg:90.25,minAvg:1957.5},
	{courses_dept:"edcp",courses_avg:90.25,maxAvg:90.25,minAvg:1955},
	{courses_dept:"edcp",courses_avg:90.24,maxAvg:90.24,minAvg:1955},
	{courses_dept:"edcp",courses_avg:90.22,maxAvg:90.22,minAvg:1900},
	{courses_dept:"edcp",courses_avg:90.2,maxAvg:90.2,minAvg:1937.33},
	{courses_dept:"edcp",courses_avg:90.14,maxAvg:90.14,minAvg:1957},
	{courses_dept:"cpsc",courses_avg:90.14,maxAvg:90.14,minAvg:1900},
	{courses_dept:"edcp",courses_avg:90.11,maxAvg:90.11,minAvg:2014},
	{courses_dept:"cpsc",courses_avg:90.11,maxAvg:90.11,minAvg:1953.5},
	{courses_dept:"edcp",courses_avg:90.06,maxAvg:90.06,minAvg:1956}];


function getInvalidTransformation(): Query {
	let query: Record<string, any> = query1;
	let resultObject = resultObject1;

	return({query, path: "courses.zip", resultObject});
}

export {getInvalidTransformation};

function getCourseKey(key: string) {
	let dataKey: string;

	switch (key) {
		case "dept":
			dataKey = "Subject";
			break;
		case "id":
			dataKey = "Course";
			break;
		case "avg":
			dataKey = "Avg";
			break;
		case "instructor":
			dataKey = "Professor";
			break;
		case "title":
			dataKey = "Title";
			break;
		case "pass":
			dataKey = "Pass";
			break;
		case "fail":
			dataKey = "Fail";
			break;
		case "audit":
			dataKey = "Audit";
			break;
		case "uuid":
			dataKey = "id";
			break;
		case "year":
			dataKey = "Year";
			break;
		default: return key;
	}

	return dataKey;
}

function getRoomKey(key: string) {
	let dataKey: string;

	return key;
}

export {getCourseKey, getRoomKey};

import {InsightError} from "../IInsightFacade";
import {checkIsOverall} from "./QueryUtil";

function wildcardStartFilter(data: any[], dataKey: string, splitString: string[]) {
	let dataYear: number;

	data = data.filter((dataClass) => {
		if (typeof dataClass[dataKey] !== "string") {
			return false;
		}

		dataYear = checkIsOverall(dataClass);
		if (dataYear === 1900) {
			dataClass.Year = 1900;
		}

		return dataClass[dataKey].endsWith(splitString[1]);
	});

	return data;
}

function wildcardEndFilter(data: any[], dataKey: string, splitString: string[]) {
	let dataYear: number;

	data = data.filter((dataClass) => {
		if (typeof dataClass[dataKey] !== "string") {
			return false;
		}

		dataYear = checkIsOverall(dataClass);
		if (dataYear === 1900) {
			dataClass.Year = 1900;
		}

		return dataClass[dataKey].startsWith(splitString[0]);
	});

	return data;
}

function wildcardIncludeFilter(data: any[], indices: number[], dataKey: string, wildcardString: string) {
	let splitString: string[] = wildcardString.split("*");
	let dataYear: number;

	data = data.filter((dataClass) => {
		if (typeof dataClass[dataKey] !== "string") {
			return false;
		}
		dataYear = checkIsOverall(dataClass);
		if (dataYear === 1900) {
			dataClass.Year = 1900;
		}

		return dataClass[dataKey].includes(splitString[1]);
	});

	return data;
}

export {wildcardStartFilter, wildcardEndFilter, wildcardIncludeFilter};

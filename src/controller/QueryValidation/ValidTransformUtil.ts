import {InsightError} from "../IInsightFacade";
import {checkValidKey, checkValidRoomKey} from "./ValidationUtil";

function checkValidTransformations(transformations: any, id: string, type: string) {
	const group: string[] = transformations.GROUP;
	const apply: any[] = transformations.APPLY;
	const applyKeys: string[] = [];

	if (typeof apply === "undefined" || typeof group === "undefined") {
		throw new InsightError("Missing apply or group in transformation");
	}

	if (!Array.isArray(group) || group.length === 0) {
		throw new InsightError("invalid transformation group");
	}

	if (!Array.isArray(apply)) {
		throw new InsightError("apply must be array");
	}

	group.forEach((g) => {
		checkValidGroup(g, id, type);

		applyKeys.push(g);
	});

	apply.forEach((a) => {
		checkValidApply(a, applyKeys, id, type);

		applyKeys.push(Object.keys(a)[0]);
	});

	return applyKeys;
}

function checkValidGroup(group: string, id: string, type: string) {
	let splitKey: string[];

	if (typeof group !== "string") {
		throw new InsightError("Type of group must be string");
	}

	splitKey = group.split("_");

	if (splitKey.length !== 2) {
		throw new InsightError("Invalid group key");
	}

	if (splitKey[0] !== id) {
		throw new InsightError();
	}

	if (type === "courses") {
		checkValidKey(group);
	} else {
		checkValidRoomKey(group);
	}
}

function checkValidApply(apply: any, applyKeys: string[], id: string, type: string) {
	const validApply: string[] = ["MAX", "MIN", "AVG", "SUM", "COUNT"];
	const applyKey: string = Object.keys(apply)[0];
	const applyBody: any = apply[applyKey];
	let applyRule: string;
	let applyRuleKey: string;

	if (Object.keys(apply).length !== 1) {
		throw new InsightError("Apply rule should have 1 key");
	}

	if (applyKey.length === 0 || applyKey.includes("_")) {
		throw new InsightError("invalid apply key");
	}

	if (Object.keys(applyBody).length !== 1) {
		throw new InsightError("Apply body should have 1 key");
	}

	if (!validApply.includes(Object.keys(applyBody)[0])) {
		throw new InsightError("Invalid apply body key");
	}

	if (applyKeys.includes(applyKey)) {
		throw new InsightError("duplicate apply key");
	}

	applyRule = Object.keys(applyBody)[0];
	applyRuleKey = applyBody[Object.keys(applyBody)[0]];

	if (typeof applyRuleKey !== "string" || applyRuleKey.split("_")[0] !== id) {
		throw new InsightError("Invalid applyRule Id");
	}

	if (applyRule !== "COUNT") {
		if (type === "courses") {
			checkValidKey(applyRuleKey, true);
		} else {
			checkValidRoomKey(applyRuleKey, true);
		}
	} else {
		if (type === "courses") {
			checkValidKey(applyRuleKey);
		} else {
			checkValidRoomKey(applyRuleKey);
		}
	}
}

export {checkValidTransformations};

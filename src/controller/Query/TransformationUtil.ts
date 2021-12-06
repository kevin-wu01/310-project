import {getRoomKey, getCourseKey} from "./DataKeyUtil";
import Decimal from "decimal.js";

function filterTransformation(data: any[], transformations: any, type: string): any[] {
	const group = transformations.GROUP;
	const apply = transformations.APPLY;
	let transformedData: any[];
	let transformedObject: any;
	let appliedData: any[] = [];

	transformedObject = data.reduce((prevVal, val) => {
		let keyString = "";
		group.forEach((g: any) => {
			let k = type === "courses" ? getCourseKey(g.split("_")[1]) : getRoomKey(g);
			let v = val[k];

			if(!v) {
				return;
			}

			if (typeof v !== "string") {
				v = v.toString();
			}

			keyString = keyString + v;
		});

		if (!prevVal[keyString]) {
			prevVal[keyString] = [];
		}

		prevVal[keyString].push(val);
		/*
		const isIdentical = prevVal.findIndex((pv: any) => {
			return isExistingValue(group, pv, val);
		});

		if (isIdentical === -1) {
			prevVal.push([val]);
		} else {
			prevVal[isIdentical].push(val);
		}
		*/
		return prevVal;
	}, {});
	let dataKeys = Object.keys(transformedObject);
	/*
	dataKeys.forEach((k) => {
		apply.forEach((a: any) => {
			let dataVal = transformedObject[k];
			let applyName = Object.keys(a)[0];
			let applyObject = a[applyName];
			let applyVal = getApplyVal(applyObject, transformedObject[k]);
		});
	});
	*/
	// console.log(transformedObject[Object.keys(transformedObject)[702]], "invalid object");
	for (let d in transformedObject) {
		apply.forEach((a: any, idx: number) => {
			let applyName = Object.keys(a)[0];
			let applyObject = a[applyName];
			// console.log(transformedObject[d][0], "transformedObject");
			let applyVal = getApplyVal(applyObject, transformedObject[d], type);

			transformedObject[d][0][applyName] = applyVal;
		});
		appliedData.push(transformedObject[d][0]);
	}
	/*
	for (let d of transformedData) {
		apply.forEach((a: any) => {
			let applyName = Object.keys(a)[0];
			let applyObject = a[applyName];
			let applyVal = getApplyVal(applyObject, d);

			d[0][applyName] = applyVal;
		});

		appliedData.push(d[0]);
	}
	*/
	return appliedData;
}

function getApplyVal(applyObject: any, data: any[], type: string) {
	let applyType = Object.keys(applyObject)[0];
	let k = applyObject[applyType].split("_")[1];
	let key = type === "courses" ? getCourseKey(k) : getRoomKey(applyObject[applyType]);
	let typeVal: number = 0;
	let totalVal = new Decimal(0);
	let count = 0;
	let uniqueArray: any[] = [];
	// console.log(data, "data");
	data.forEach((d, idx) => {
		let value = d[key];
		let addNum: Decimal;

		if (key === "Year" && d.Section === "overall") {
			value = 1900;
		}
		if (typeof d !== "object") {
			return;
		}
		switch(applyType) {
			case "MAX":
				typeVal = idx === 0 ? value : typeVal > value ? typeVal : value;
				break;
			case "MIN":
				typeVal = idx === 0 ? value : typeVal < value ? typeVal : value;
				break;
			case "AVG":
				addNum = new Decimal(value);
				totalVal = totalVal.add(addNum);
				count++;
				break;
			case "SUM":
				addNum = new Decimal(value);
				totalVal = totalVal.add(addNum);
				break;
			case "COUNT":
				if (!uniqueArray.includes(value)) {
					uniqueArray.push(value);
				}
				break;
		}

	});

	typeVal = calculateVal(applyType, typeVal, count, totalVal, uniqueArray);

	return typeVal;
}

function calculateVal(type: string, typeVal: number, count: number, totalVal: Decimal, uniqueArray: any[]) {
	let avg;
	// console.log(type, "type");
	switch(type) {
		case "AVG":
			avg = totalVal.toNumber() / count;
			typeVal = Number(avg.toFixed(2));
			break;
		case "SUM":
			typeVal = Number(totalVal.toFixed(2));
			break;
		case "COUNT":
			// console.log(uniqueArray, "uniqueArray");
			typeVal = uniqueArray.length;
			break;
	}

	if (typeof typeVal === "string") {
		typeVal = parseInt(typeVal, 10);
	}

	return typeVal;
}

function isExistingValue(group: string[], pv: any, val: any): boolean {
	let identical = true;

	group.forEach((g: string) => {
		let key = getCourseKey(g.split("_")[1]);

		if (pv[0][key] !== val[key]) {
			identical = false;
		}
	});

	return identical;
}

export {filterTransformation};

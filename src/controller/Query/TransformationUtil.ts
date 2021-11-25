import {getDataKey} from "./QueryUtil";
import Decimal from "decimal.js";

function filterTransformation(data: any[], transformations: any): any[] {
	const group = transformations.GROUP;
	const apply = transformations.APPLY;
	let transformedData: any[];
	let appliedData: any[] = [];

	transformedData = data.reduce((prevVal, val) => {
		const isIdentical = prevVal.findIndex((pv: any) => {
			return isExistingValue(group, pv, val);
		});

		if (isIdentical === -1) {
			prevVal.push([val]);
		} else {
			prevVal[isIdentical].push(val);
		}

		return prevVal;
	}, []);

	for (let d of transformedData) {
		apply.forEach((a: any) => {
			let applyName = Object.keys(a)[0];
			let applyObject = a[applyName];
			let applyVal = getApplyVal(applyObject, d);

			d[0][applyName] = applyVal;
		});

		appliedData.push(d[0]);
	}

	return appliedData;
}

function getApplyVal(applyObject: any, data: any[]) {
	let type = Object.keys(applyObject)[0];
	let key = getDataKey(applyObject[type].split("_")[1]);
	let typeVal: number = 0;
	let totalVal = new Decimal(0);
	let count = 0;
	let uniqueArray: any[] = [];

	data.forEach((d, idx) => {
		let value = d[key];
		let addNum: Decimal;

		switch(type) {
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
				// console.log(addNum, "addNum");
				totalVal = totalVal.add(addNum);
				break;
			case "COUNT":
				if (!uniqueArray.includes(value)) {
					uniqueArray.push(value);
				}
				break;
		}

	});

	typeVal = calculateVal(type, typeVal, count, totalVal, uniqueArray);

	return typeVal;
}

function calculateVal(type: string, typeVal: number, count: number, totalVal: Decimal, uniqueArray: any[]) {
	let avg;

	switch(type) {
		case "AVG":
			avg = totalVal.toNumber() / count;
			typeVal = Number(avg.toFixed(2));
			break;
		case "SUM":
			typeVal = Number(totalVal.toFixed(2));
			break;
		case "COUNT":
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
		let key = getDataKey(g.split("_")[1]);

		if (pv[0][key] !== val[key]) {
			identical = false;
		}
	});

	return identical;
}

export {filterTransformation};

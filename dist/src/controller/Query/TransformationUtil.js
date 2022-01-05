"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTransformation = void 0;
const DataKeyUtil_1 = require("./DataKeyUtil");
const decimal_js_1 = __importDefault(require("decimal.js"));
function filterTransformation(data, transformations, type) {
    const group = transformations.GROUP;
    const apply = transformations.APPLY;
    let transformedData;
    let transformedObject;
    let appliedData = [];
    transformedObject = data.reduce((prevVal, val) => {
        let keyString = "";
        group.forEach((g) => {
            let k = type === "courses" ? (0, DataKeyUtil_1.getCourseKey)(g.split("_")[1]) : (0, DataKeyUtil_1.getRoomKey)(g);
            let v = val[k];
            if (!v) {
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
        return prevVal;
    }, {});
    let dataKeys = Object.keys(transformedObject);
    for (let d in transformedObject) {
        apply.forEach((a, idx) => {
            let applyName = Object.keys(a)[0];
            let applyObject = a[applyName];
            let applyVal = getApplyVal(applyObject, transformedObject[d], type);
            transformedObject[d][0][applyName] = applyVal;
        });
        appliedData.push(transformedObject[d][0]);
    }
    return appliedData;
}
exports.filterTransformation = filterTransformation;
function getApplyVal(applyObject, data, type) {
    let applyType = Object.keys(applyObject)[0];
    let k = applyObject[applyType].split("_")[1];
    let key = type === "courses" ? (0, DataKeyUtil_1.getCourseKey)(k) : (0, DataKeyUtil_1.getRoomKey)(applyObject[applyType]);
    let typeVal = 0;
    let totalVal = new decimal_js_1.default(0);
    let count = 0;
    let uniqueArray = [];
    data.forEach((d, idx) => {
        let value = d[key];
        let addNum;
        if (key === "Year" && d.Section === "overall") {
            value = 1900;
        }
        if (typeof d !== "object") {
            return;
        }
        switch (applyType) {
            case "MAX":
                typeVal = idx === 0 ? value : typeVal > value ? typeVal : value;
                break;
            case "MIN":
                typeVal = idx === 0 ? value : typeVal < value ? typeVal : value;
                break;
            case "AVG":
                addNum = new decimal_js_1.default(value);
                totalVal = totalVal.add(addNum);
                count++;
                break;
            case "SUM":
                addNum = new decimal_js_1.default(value);
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
function calculateVal(type, typeVal, count, totalVal, uniqueArray) {
    let avg;
    switch (type) {
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
function isExistingValue(group, pv, val) {
    let identical = true;
    group.forEach((g) => {
        let key = (0, DataKeyUtil_1.getCourseKey)(g.split("_")[1]);
        if (pv[0][key] !== val[key]) {
            identical = false;
        }
    });
    return identical;
}
//# sourceMappingURL=TransformationUtil.js.map
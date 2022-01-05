"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsOverall = exports.filterOptions = exports.filterData = void 0;
const IInsightFacade_1 = require("../IInsightFacade");
const WildcardUtil_1 = require("./WildcardUtil");
const DataKeyUtil_1 = require("./DataKeyUtil");
function filterData(data, query, type) {
    const queryString = Object.keys(query)[0];
    let removeData;
    switch (queryString) {
        case "LT":
            data = filterMComparator(data, "LT", Object.keys(query.LT)[0], query.LT[Object.keys(query.LT)[0]], type);
            break;
        case "GT":
            data = filterMComparator(data, "GT", Object.keys(query.GT)[0], query.GT[Object.keys(query.GT)[0]], type);
            break;
        case "EQ":
            data = filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query.EQ[Object.keys(query.EQ)[0]], type);
            break;
        case "AND":
            data = filterAND(data, query.AND, type);
            break;
        case "OR":
            data = filterOR(data, query.OR, type);
            break;
        case "IS":
            data = filterSComparator(data, Object.keys(query.IS)[0], query.IS[Object.keys(query.IS)[0]], type);
            break;
        case "NOT":
            removeData = filterData(data, query.NOT, type);
            data = data.filter((x) => !removeData.includes(x));
            break;
        default: throw new IInsightFacade_1.InsightError();
    }
    return data;
}
exports.filterData = filterData;
function filterAND(data, queryArray, type) {
    let queryResults = [];
    for (let query of queryArray) {
        queryResults.push(filterData(data, query, type));
    }
    queryResults = queryResults.reduce((a, b) => a.filter((c) => b.includes(c)));
    return queryResults;
}
function filterOR(data, queryArray, type) {
    let queryResults = [];
    let resultSet = new Set();
    for (let query of queryArray) {
        queryResults.push(filterData(data, query, type));
    }
    for (let datasetItem of queryResults) {
        for (let item of datasetItem) {
            resultSet.add(item);
        }
    }
    let result = [...resultSet];
    return result;
}
function filterMComparator(data, comparator, field, value, type) {
    let filteredData = [];
    let dataYear;
    const dataKey = type === "courses" ? (0, DataKeyUtil_1.getCourseKey)(field.split("_")[1]) : (0, DataKeyUtil_1.getRoomKey)(field);
    switch (comparator) {
        case "LT":
            filteredData = data.filter((dataClass) => {
                if (type === "courses") {
                    dataYear = checkIsOverall(dataClass);
                    if (dataYear === 1900) {
                        dataClass.Year = 1900;
                    }
                }
                return dataClass[dataKey] < value;
            });
            break;
        case "GT":
            filteredData = data.filter((dataClass) => {
                if (type === "courses") {
                    dataYear = checkIsOverall(dataClass);
                    if (dataYear === 1900) {
                        dataClass.Year = 1900;
                    }
                }
                return dataClass[dataKey] > value;
            });
            break;
        case "EQ":
            filteredData = data.filter((dataClass) => {
                if (type === "courses") {
                    dataYear = checkIsOverall(dataClass);
                    if (dataYear === 1900) {
                        dataClass.Year = 1900;
                    }
                }
                return dataClass[dataKey] === value;
            });
            break;
    }
    return filteredData;
}
function checkIsOverall(dataObject) {
    if (dataObject.Section === "overall") {
        return 1900;
    }
    else {
        return dataObject["Year"];
    }
}
exports.checkIsOverall = checkIsOverall;
function filterOptions(data, query, type) {
    const dataColumns = query.COLUMNS;
    const order = query.ORDER;
    let filteredData = [];
    for (let section = 0; section < data.length; section++) {
        if (typeof data[section] !== "object") {
            continue;
        }
        filteredData.push({});
        for (let key of dataColumns) {
            let dataKey;
            if (key.split("_").length === 2) {
                dataKey = type === "courses" ? (0, DataKeyUtil_1.getCourseKey)(key.split("_")[1]) : (0, DataKeyUtil_1.getRoomKey)(key);
            }
            else {
                dataKey = key;
            }
            switch (dataKey) {
                case "id":
                    filteredData[section][key] = data[section][dataKey].toString();
                    break;
                case "Year":
                    filteredData[section][key] = parseInt(data[section][dataKey], 10);
                    break;
                default: filteredData[section][key] = data[section][dataKey];
            }
        }
    }
    if (order) {
        filteredData = sortOrder(filteredData, order);
    }
    return filteredData;
}
exports.filterOptions = filterOptions;
function sortOrder(filteredData, order) {
    if (typeof order === "string") {
        filteredData.sort((a, b) => {
            return a[order] >= b[order] ? 1 : -1;
        });
    }
    else {
        const keys = order.keys;
        const dir = order.dir;
        filteredData.sort((a, b) => {
            const diffKey = keys.find((k) => {
                if (a[k] !== b[k]) {
                    return k;
                }
            });
            if (typeof diffKey !== "undefined") {
                if (dir === "UP") {
                    return a[diffKey] >= b[diffKey] ? 1 : -1;
                }
                else {
                    return a[diffKey] <= b[diffKey] ? 1 : -1;
                }
            }
            else {
                return 1;
            }
        });
    }
    return filteredData;
}
function filterSComparator(data, field, value, type) {
    let filteredData;
    let dataKey;
    let dataYear;
    if (type === "courses") {
        dataKey = type === "courses" ? (0, DataKeyUtil_1.getCourseKey)(field.split("_")[1]) : (0, DataKeyUtil_1.getRoomKey)(field);
    }
    else {
        dataKey = field;
    }
    if (!value.includes("*")) {
        filteredData = data.filter((dataClass) => {
            dataYear = checkIsOverall(dataClass);
            if (dataYear === 1900) {
                dataClass.Year = 1900;
            }
            if (dataKey === "id") {
                if (typeof dataClass[dataKey] === "number") {
                    dataClass[dataKey] = dataClass[dataKey].toString();
                }
            }
            return dataClass[dataKey] === value;
        });
    }
    else {
        filteredData = filterWildcardString(data, dataKey, value);
    }
    return filteredData;
}
function filterWildcardString(data, dataKey, wildcardString) {
    let indices = [];
    let splitString = wildcardString.split("*");
    let dataYear;
    for (let i = 0; i < wildcardString.length; i++) {
        if (wildcardString[i] === "*") {
            indices.push(i);
        }
    }
    if (wildcardString.length === 1) {
        return data;
    }
    if (indices.length === 1) {
        switch (indices[0]) {
            case 0:
                data = (0, WildcardUtil_1.wildcardStartFilter)(data, dataKey, splitString);
                break;
            case wildcardString.length - 1:
                data = (0, WildcardUtil_1.wildcardEndFilter)(data, dataKey, splitString);
                break;
            default: throw new IInsightFacade_1.InsightError("wildcard must be in beginning or end of string");
        }
    }
    else {
        data = (0, WildcardUtil_1.wildcardIncludeFilter)(data, indices, dataKey, wildcardString);
    }
    return data;
}
//# sourceMappingURL=QueryUtil.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsOverall = exports.filterOptions = exports.filterData = void 0;
const IInsightFacade_1 = require("./IInsightFacade");
const WildcardUtil_1 = require("./WildcardUtil");
function filterData(data, query) {
    const queryString = Object.keys(query)[0];
    let removeData;
    switch (queryString) {
        case "LT":
            data = filterMComparator(data, "LT", Object.keys(query.LT)[0], query.LT[Object.keys(query.LT)[0]]);
            break;
        case "GT":
            data = filterMComparator(data, "GT", Object.keys(query.GT)[0], query.GT[Object.keys(query.GT)[0]]);
            break;
        case "EQ":
            data = filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query.EQ[Object.keys(query.EQ)[0]]);
            break;
        case "AND":
            data = filterAND(data, query.AND);
            break;
        case "OR":
            data = filterOR(data, query.OR);
            break;
        case "IS":
            data = filterSComparator(data, Object.keys(query.IS)[0], query.IS[Object.keys(query.IS)[0]]);
            break;
        case "NOT":
            removeData = filterData(data, query.NOT);
            data = data.filter((x) => !removeData.includes(x));
            break;
        default: throw new IInsightFacade_1.InsightError();
    }
    return data;
}
exports.filterData = filterData;
function filterAND(data, queryArray) {
    let queryResults = [];
    for (let query of queryArray) {
        queryResults.push(filterData(data, query));
    }
    queryResults = queryResults.reduce((a, b) => a.filter((c) => b.includes(c)));
    return queryResults;
}
function filterOR(data, queryArray) {
    let queryResults = [];
    let resultSet = new Set();
    for (let query of queryArray) {
        queryResults.push(filterData(data, query));
    }
    for (let datasetItem of queryResults) {
        for (let item of datasetItem) {
            resultSet.add(item);
        }
    }
    let result = [...resultSet];
    return result;
}
function filterMComparator(data, comparator, field, value) {
    let filteredData = [];
    let dataYear;
    const dataKey = getDataKey(field.split("_")[1]);
    switch (comparator) {
        case "LT":
            filteredData = data.filter((dataClass) => {
                dataYear = checkIsOverall(dataClass);
                if (dataYear === 1900) {
                    dataClass.Year = 1900;
                }
                return dataClass[dataKey] < value;
            });
            break;
        case "GT":
            filteredData = data.filter((dataClass) => {
                dataYear = checkIsOverall(dataClass);
                if (dataYear === 1900) {
                    dataClass.Year = 1900;
                }
                return dataClass[dataKey] > value;
            });
            break;
        case "EQ":
            filteredData = data.filter((dataClass) => {
                dataYear = checkIsOverall(dataClass);
                if (dataYear === 1900) {
                    dataClass.Year = 1900;
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
function filterOptions(data, query) {
    const dataColumns = query.COLUMNS;
    const sortColumn = query.ORDER;
    let filteredData = [];
    for (let section = 0; section < data.length; section++) {
        if (typeof data[section] !== "object") {
            continue;
        }
        filteredData.push({});
        for (let key of dataColumns) {
            let dataKey = getDataKey(key.split("_")[1]);
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
    filteredData.sort((a, b) => {
        return a[sortColumn] >= b[sortColumn] ? 1 : -1;
    });
    return filteredData;
}
exports.filterOptions = filterOptions;
function filterSComparator(data, field, value) {
    let filteredData;
    let dataKey = getDataKey(field.split("_")[1]);
    let dataYear;
    if (!value.includes("*")) {
        filteredData = data.filter((dataClass) => {
            dataYear = checkIsOverall(dataClass);
            if (dataYear === 1900) {
                dataClass.Year = 1900;
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
    console.log("inside filterWildcardString");
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
function getDataKey(key) {
    let dataKey;
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
        default: throw new IInsightFacade_1.InsightError();
    }
    return dataKey;
}
//# sourceMappingURL=QueryUtil.js.map
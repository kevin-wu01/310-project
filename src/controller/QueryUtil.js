"use strict";
exports.__esModule = true;
exports.checkValidID = exports.filterOptions = exports.filterData = void 0;
var IInsightFacade_1 = require("./IInsightFacade");
function filterData(data, query) {
    var queryString = Object.keys(query)[0];
    var removeData;
    switch (queryString) {
        case "LT":
            checkValidMComparator(query);
            data = filterMComparator(data, "LT", Object.keys(query.LT)[0], query[Object.keys(query.LT)[0]]);
            // lower than
            break;
        case "GT":
            checkValidMComparator(query);
            data = filterMComparator(data, "GT", Object.keys(query.GT)[0], query[Object.keys(query.LT)[0]]);
            // greater than
            break;
        case "EQ":
            checkValidMComparator(query);
            data = filterMComparator(data, "EQ", Object.keys(query.EQ)[0], query[Object.keys(query.LT)[0]]);
            // equal to
            break;
        case "AND":
            // intersection of recursion
            data = filterAND(data, query.AND);
            break;
        case "OR":
            // union of recursion
            data = filterOR(data, query.OR);
            break;
        case "IS":
            data = filterSComparator(data, Object.keys(query.IS)[0], query[Object.keys(query.IS)[0]]);
            break;
        case "NOT":
            checkValidNOTComparator(query);
            removeData = filterData(data, query.NOT);
            data = data.filter(function (x) { return !removeData.includes(x); });
            break;
        default: throw new IInsightFacade_1.InsightError();
    }
    return data;
}
exports.filterData = filterData;
function filterAND(data, queryArray) {
    var queryResults = [];
    checkValidArrayComparator(queryArray);
    for (var _i = 0, queryArray_1 = queryArray; _i < queryArray_1.length; _i++) {
        var query = queryArray_1[_i];
        queryResults.push(filterData(data, query));
    }
    queryResults = queryResults.reduce(function (a, b) { return a.filter(function (c) { return b.includes(c); }); }); // intersection of multiple arrays
    return queryResults;
}
function filterOR(data, queryArray) {
    var queryResults = [];
    checkValidArrayComparator(queryArray);
    for (var _i = 0, queryArray_2 = queryArray; _i < queryArray_2.length; _i++) {
        var query = queryArray_2[_i];
        queryResults.push(filterData(data, query));
    }
    queryResults = queryResults.filter(function (classData, index, self) {
        return index === self.findIndex(function (t) {
            return t.name === classData.name; // replace with data properties
        });
    });
    return queryResults;
}
function checkValidArrayComparator(queryArray) {
    if (!Array.isArray(queryArray)) {
        throw new IInsightFacade_1.InsightError();
    }
    if (queryArray.length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
}
function checkValidMComparator(query) {
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
    if (typeof query[Object.keys(query)[0]] !== "number") {
        throw new IInsightFacade_1.InsightError();
    }
}
function filterMComparator(data, comparator, field, value) {
    var filteredData = [];
    switch (comparator) {
        case "LT":
            filteredData = data.filter(function (dataClass) {
                return dataClass[field] < value;
            });
            break;
        case "GT":
            filteredData = data.filter(function (dataClass) {
                return dataClass[field] > value;
            });
            break;
        case "EQ":
            filteredData = data.filter(function (dataClass) {
                return dataClass[field] === value;
            });
            break;
    }
    return filteredData;
}
function filterOptions(data, query) {
    var dataColumns = query.COLUMNS;
    var sortColumn = query.ORDER.split("_")[1];
    var filteredData = [];
    if (dataColumns.length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
    checkValidKey(sortColumn);
    for (var _i = 0, dataColumns_1 = dataColumns; _i < dataColumns_1.length; _i++) {
        var key = dataColumns_1[_i];
        checkValidKey(key.split("_")[1]);
    }
    for (var section = 0; section < data.length; section++) {
        filteredData.push({});
        for (var _a = 0, dataColumns_2 = dataColumns; _a < dataColumns_2.length; _a++) {
            var key = dataColumns_2[_a];
            var substrKey = key.split("_")[1];
            filteredData[section][substrKey] = data[section][substrKey];
        }
    }
    filteredData.sort(function (a, b) {
        return a[sortColumn] - b[sortColumn];
    });
    return filteredData;
}
exports.filterOptions = filterOptions;
function checkValidKey(key) {
    var validKeys = ["avg", "pass", "fail", "audit", "year",
        "dept", "id", "instructor", "title", "uuid"];
    if (!validKeys.includes(key)) {
        throw new IInsightFacade_1.InsightError();
    }
}
function filterSComparator(data, field, value) {
    if (field !== "dept" && field !== "id" && field !== "instructor" && field !== "title" && field !== "uuid") {
        throw new IInsightFacade_1.InsightError();
    }
    var filteredData;
    filteredData = data.filter(function (dataClass) {
        return dataClass[field] === value;
    });
    return filteredData;
}
function checkValidID(options) {
    var columns = options.COLUMNS;
    var order = options.ORDER;
    var id;
    if (columns.length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
    id = columns[0].split("_")[0];
    columns.forEach(function (c) {
        if (id !== c.split("_")[0]) {
            throw new IInsightFacade_1.InsightError();
        }
    });
    if (id !== order.split("_")[0]) {
        throw new IInsightFacade_1.InsightError();
    }
    return id;
}
exports.checkValidID = checkValidID;
function checkValidNOTComparator(query) {
    if (typeof query !== "object") {
        throw new IInsightFacade_1.InsightError();
    }
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
}

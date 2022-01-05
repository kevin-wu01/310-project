"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildcardIncludeFilter = exports.wildcardEndFilter = exports.wildcardStartFilter = void 0;
const QueryUtil_1 = require("./QueryUtil");
function wildcardStartFilter(data, dataKey, splitString) {
    let dataYear;
    data = data.filter((dataClass) => {
        if (typeof dataClass[dataKey] !== "string") {
            return false;
        }
        dataYear = (0, QueryUtil_1.checkIsOverall)(dataClass);
        if (dataYear === 1900) {
            dataClass.Year = 1900;
        }
        return dataClass[dataKey].endsWith(splitString[1]);
    });
    return data;
}
exports.wildcardStartFilter = wildcardStartFilter;
function wildcardEndFilter(data, dataKey, splitString) {
    let dataYear;
    data = data.filter((dataClass) => {
        if (typeof dataClass[dataKey] !== "string") {
            return false;
        }
        dataYear = (0, QueryUtil_1.checkIsOverall)(dataClass);
        if (dataYear === 1900) {
            dataClass.Year = 1900;
        }
        return dataClass[dataKey].startsWith(splitString[0]);
    });
    return data;
}
exports.wildcardEndFilter = wildcardEndFilter;
function wildcardIncludeFilter(data, indices, dataKey, wildcardString) {
    let splitString = wildcardString.split("*");
    let dataYear;
    data = data.filter((dataClass) => {
        if (typeof dataClass[dataKey] !== "string") {
            return false;
        }
        dataYear = (0, QueryUtil_1.checkIsOverall)(dataClass);
        if (dataYear === 1900) {
            dataClass.Year = 1900;
        }
        return dataClass[dataKey].includes(splitString[1]);
    });
    return data;
}
exports.wildcardIncludeFilter = wildcardIncludeFilter;
//# sourceMappingURL=WildcardUtil.js.map
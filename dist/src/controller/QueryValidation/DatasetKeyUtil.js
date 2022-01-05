"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidKey = exports.checkValidRoomKey = exports.getQueryId = void 0;
const IInsightFacade_1 = require("../IInsightFacade");
function getQueryId(query) {
    const options = query.OPTIONS;
    const transformations = query.TRANSFORMATIONS;
    let id;
    if (typeof options !== "object" || !Object.keys(options).includes("COLUMNS")) {
        throw new IInsightFacade_1.InsightError("invalid options object");
    }
    if (!Array.isArray(options.COLUMNS)) {
        throw new IInsightFacade_1.InsightError("invalid columns");
    }
    if (transformations) {
        const group = transformations.GROUP;
        if (!Array.isArray(group) || Object.keys(group).length === 0) {
            throw new IInsightFacade_1.InsightError("invalid group");
        }
        id = group[0].split("_")[0];
    }
    else {
        const columns = options.COLUMNS;
        if (columns.length === 0) {
            throw new IInsightFacade_1.InsightError("columns array cannot be empty");
        }
        id = columns[0].split("_")[0];
    }
    return id;
}
exports.getQueryId = getQueryId;
function checkValidKey(key, numOnly = false, customKeys = [], SOnly = false) {
    const validKeys = ["avg", "pass", "fail", "audit", "year",
        "dept", "id", "instructor", "title", "uuid"];
    const numericKeys = ["avg", "pass", "fail", "audit", "year"];
    const stringKeys = ["dept", "id", "instructor", "title", "uuid"];
    const splitKey = key.split("_")[1];
    if (numOnly) {
        if (!numericKeys.includes(splitKey)) {
            throw new IInsightFacade_1.InsightError("Invalid key");
        }
    }
    else {
        if (SOnly) {
            if (!stringKeys.includes(splitKey)) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
        }
        else {
            if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
        }
        console.log(key, "key");
    }
}
exports.checkValidKey = checkValidKey;
function checkValidRoomKey(key, numOnly = false, customKeys = [], SOnly = false) {
    const validKeys = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type",
        "furniture", "href"];
    const numericKeys = ["lat", "lon", "seats"];
    const stringKeys = ["fullname", "shortname", "number", "name", "address", "type", "furniture", "href"];
    const splitKey = key.split("_")[1];
    if (numOnly) {
        if (!numericKeys.includes(splitKey)) {
            throw new IInsightFacade_1.InsightError("Invalid key");
        }
    }
    else {
        if (SOnly) {
            if (!stringKeys.includes(splitKey)) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
        }
        else {
            if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
        }
    }
}
exports.checkValidRoomKey = checkValidRoomKey;
//# sourceMappingURL=DatasetKeyUtil.js.map
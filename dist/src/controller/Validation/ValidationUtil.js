"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidQuery = void 0;
const IInsightFacade_1 = require("../IInsightFacade");
function checkValidQuery(query) {
    const where = query.WHERE;
    const options = query.OPTIONS;
    const transformations = query.TRANSFORMATIONS;
    let customKeys = [];
    let id;
    if (Object.keys(transformations).length !== 0) {
        id = getQueryId(transformations.GROUP);
        customKeys = checkValidTransformations(transformations, id);
    }
    else {
        id = getQueryId(options.COLUMNS);
    }
    checkValidOptions(options, customKeys, id);
    if (Object.keys(where).length !== 0) {
        checkValidWhere(where, id);
    }
    return id;
}
exports.checkValidQuery = checkValidQuery;
function getQueryId(columns) {
    let id = columns[0].split("_")[0];
    if (id.length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    return id;
}
function checkValidWhere(query, id) {
    const queryString = Object.keys(query)[0];
    if (Object.keys(query).length !== 1) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    switch (queryString) {
        case "LT":
            checkValidMComparator(query.LT, id);
            break;
        case "GT":
            checkValidMComparator(query.GT, id);
            break;
        case "EQ":
            checkValidMComparator(query.EQ, id);
            break;
        case "AND":
            checkValidLogicalComparator(query.AND, id);
            break;
        case "OR":
            checkValidLogicalComparator(query.OR, id);
            break;
        case "IS":
            checkValidSComparator(query.IS, id);
            break;
        case "NOT":
            checkValidNOTComparator(query.NOT, id);
            break;
        default: throw new IInsightFacade_1.InsightError("Invalid format");
    }
}
function checkValidMComparator(query, id) {
    if (typeof query !== "object") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query)[0].split("_")[0] !== id) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (typeof query[Object.keys(query)[0]] !== "number") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
}
function checkValidLogicalComparator(query, id) {
    if (!Array.isArray(query)) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (query.length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    query.forEach((q) => {
        if (Object.keys(q).length === 0) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
        checkValidWhere(q, id);
    });
}
function checkValidSComparator(query, id) {
    if (typeof query !== "object" || 11 > 12) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query)[0].split("_")[0] !== id) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (typeof query[Object.keys(query)[0]] !== "string") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (query[Object.keys(query)[0]].includes("*")) {
        checkValidWildcardString(query[Object.keys(query)[0]]);
    }
}
function checkValidWildcardString(wildcard) {
    const wildcardArray = wildcard.split("*");
    if (wildcardArray.length > 3) {
        throw new IInsightFacade_1.InsightError("Invalid wildcard");
    }
    if (wildcardArray.length === 3) {
        if (!(wildcard.startsWith("*") && wildcard.endsWith("*"))) {
            throw new IInsightFacade_1.InsightError("Invalid wildcard");
        }
    }
    else {
        if (!(wildcard.startsWith("*") || wildcard.endsWith("*"))) {
            throw new IInsightFacade_1.InsightError("Invalid wildcard");
        }
    }
}
function checkValidNOTComparator(query, id) {
    if (typeof query !== "object") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    checkValidWhere(query, id);
}
function checkValidOptions(options, customKeys, id) {
    let optionKeys = Object.keys(options);
    let columns = options.COLUMNS;
    let order = options.ORDER;
    if (!Array.isArray(options.COLUMNS) || typeof options.ORDER !== "string") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (optionKeys.length > 2) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (optionKeys.length === 2) {
        if (optionKeys.indexOf("COLUMNS") === -1 || optionKeys.indexOf("ORDER") === -1) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
    }
    else {
        if (optionKeys.indexOf("COLUMNS") === -1) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
    }
    if (typeof columns[0] !== "string" || columns[0].split("_").length > 2) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (customKeys.length !== 0) {
        if (columns.length !== customKeys.length) {
            throw new IInsightFacade_1.InsightError("different customKey column length");
        }
        columns.forEach((c) => {
            if (!customKeys.includes(c)) {
                throw new IInsightFacade_1.InsightError("transformation and option columns are different");
            }
        });
    }
    else {
        columns.forEach((c) => {
            if (typeof c !== "string" || id !== c.split("_")[0]) {
                throw new IInsightFacade_1.InsightError("Invalid format");
            }
            checkValidKey(c, false);
        });
    }
    if (order) {
        if (id !== order.split("_")[0] || !columns.includes(order)) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
        checkValidKey(order);
    }
    return id;
}
function checkValidTransformations(transformations, id) {
    const group = transformations.GROUP;
    const apply = transformations.APPLY;
    const applyKeys = [];
    let splitKey;
    if (typeof apply === "undefined" || typeof group === "undefined") {
        throw new IInsightFacade_1.InsightError("Missing apply or group in transformation");
    }
    if (group.length === 0) {
        throw new IInsightFacade_1.InsightError();
    }
    group.forEach((g) => {
        if (typeof g !== "string") {
            throw new IInsightFacade_1.InsightError("Type of group must be string");
        }
        splitKey = g.split("_");
        if (splitKey[0] !== id) {
            throw new IInsightFacade_1.InsightError();
        }
        checkValidKey(g);
        applyKeys.push(g);
    });
    apply.forEach((a) => {
        checkValidApply(a, id);
        applyKeys.push(Object.keys(a)[0]);
    });
    return applyKeys;
}
function checkValidApply(apply, id) {
    const validApply = ["MAX", "MIN", "AVG", "SUM", "COUNT"];
    const applyKey = Object.keys(apply)[0];
    const applyBody = apply[applyKey];
    if (Object.keys(apply).length !== 1) {
        throw new IInsightFacade_1.InsightError("Apply rule should have 1 key");
    }
    if (applyKey.length === 0 || applyKey.includes("_")) {
        throw new IInsightFacade_1.InsightError("invalid apply key");
    }
    if (Object.keys(applyBody).length !== 1) {
        throw new IInsightFacade_1.InsightError("Apply body should have 1 key");
    }
    if (!validApply.includes(Object.keys(applyBody)[0])) {
        throw new IInsightFacade_1.InsightError("Invalid apply body key");
    }
    if (applyBody[Object.keys(applyBody)[0]] !== "COUNT") {
        checkValidKey(applyBody[Object.keys(applyBody)[0]], true);
    }
    else {
        checkValidKey(applyBody[Object.keys(applyBody)[0]]);
    }
}
function checkValidKey(key, numOnly = false, customKeys = []) {
    const validKeys = ["avg", "pass", "fail", "audit", "year",
        "dept", "id", "instructor", "title", "uuid"];
    const numericKeys = ["avg", "pass", "fail", "audit", "year"];
    const splitKey = key.split("_")[1];
    if (numOnly) {
        if (!numericKeys.includes(splitKey)) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
    }
    else {
        if (!validKeys.includes(splitKey) && !customKeys.includes(key)) {
            throw new IInsightFacade_1.InsightError("Invalid format");
        }
    }
}
function checkValidRoomKey(key) {
    const validKeys = ["fullname", "shortname", "number", "name", "address", "lat", "lon", "seats", "type",
        "furniture", "href"];
    if (!validKeys.includes(key)) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
}
//# sourceMappingURL=ValidationUtil.js.map
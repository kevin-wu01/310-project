"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidRoomKey = exports.checkValidKey = exports.checkValidQuery = void 0;
const IInsightFacade_1 = require("../IInsightFacade");
const ValidTransformUtil_1 = require("./ValidTransformUtil");
const DatasetKeyUtil_1 = require("./DatasetKeyUtil");
Object.defineProperty(exports, "checkValidKey", { enumerable: true, get: function () { return DatasetKeyUtil_1.checkValidKey; } });
Object.defineProperty(exports, "checkValidRoomKey", { enumerable: true, get: function () { return DatasetKeyUtil_1.checkValidRoomKey; } });
function checkValidQuery(query, type) {
    const where = query.WHERE;
    const options = query.OPTIONS;
    const transformations = query.TRANSFORMATIONS;
    let customKeys = [];
    let id;
    Object.keys(query).forEach((key) => {
        const validKeys = ["WHERE", "OPTIONS", "TRANSFORMATIONS"];
        if (!validKeys.includes(key)) {
            throw new IInsightFacade_1.InsightError("invalid query body");
        }
    });
    if (Object.keys(options).length === 0 || !Object.keys(options).includes("COLUMNS")) {
        throw new IInsightFacade_1.InsightError("Invalid options");
    }
    if (!Array.isArray(options.COLUMNS)) {
        throw new IInsightFacade_1.InsightError("Invalid columns");
    }
    {
        if (transformations) {
            if (Object.keys(transformations).length !== 2) {
                throw new IInsightFacade_1.InsightError("Transformation missing keys");
            }
            if (transformations.GROUP.length === 0) {
                throw new IInsightFacade_1.InsightError("Group must be non-empty array");
            }
            id = getQueryId(transformations.GROUP);
            customKeys = (0, ValidTransformUtil_1.checkValidTransformations)(transformations, id, type);
        }
        else {
            id = getQueryId(options.COLUMNS);
        }
    }
    checkValidOptions(options, customKeys, id, type);
    if (Object.keys(where).length !== 0) {
        checkValidWhere(where, id, type);
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
function checkValidWhere(query, id, type) {
    const queryString = Object.keys(query)[0];
    if (Object.keys(query).length !== 1) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    switch (queryString) {
        case "LT":
            checkValidMComparator(query.LT, id, type);
            break;
        case "GT":
            checkValidMComparator(query.GT, id, type);
            break;
        case "EQ":
            checkValidMComparator(query.EQ, id, type);
            break;
        case "AND":
            checkValidLogicalComparator(query.AND, id, type);
            break;
        case "OR":
            checkValidLogicalComparator(query.OR, id, type);
            break;
        case "IS":
            checkValidSComparator(query.IS, id, type);
            break;
        case "NOT":
            checkValidNOTComparator(query.NOT, id, type);
            break;
        default: throw new IInsightFacade_1.InsightError("Invalid format");
    }
}
function checkValidMComparator(query, id, type) {
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
    console.log(Object.keys(query)[0].split("_")[1], "key");
    console.log(type, "type");
    if (type === "courses") {
        (0, DatasetKeyUtil_1.checkValidKey)(Object.keys(query)[0], true);
    }
    else {
        (0, DatasetKeyUtil_1.checkValidRoomKey)(Object.keys(query)[0], true);
    }
}
function checkValidLogicalComparator(query, id, type) {
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
        checkValidWhere(q, id, type);
    });
}
function checkValidSComparator(query, id, type) {
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
    if (type === "courses") {
        (0, DatasetKeyUtil_1.checkValidKey)(Object.keys(query)[0], false, [], true);
    }
    else {
        (0, DatasetKeyUtil_1.checkValidRoomKey)(Object.keys(query)[0], false, [], true);
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
function checkValidNOTComparator(query, id, type) {
    if (typeof query !== "object") {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    if (Object.keys(query).length > 1 || Object.keys(query).length === 0) {
        throw new IInsightFacade_1.InsightError("Invalid format");
    }
    checkValidWhere(query, id, type);
}
function checkValidOptions(options, customKeys, id, type) {
    let optionKeys = Object.keys(options);
    let columns = options.COLUMNS;
    let order = options.ORDER;
    if (!Array.isArray(options.COLUMNS)) {
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
        columns.forEach((c) => {
            if (!customKeys.includes(c)) {
                throw new IInsightFacade_1.InsightError("column and transformation arrays different");
            }
        });
    }
    else {
        columns.forEach((c) => {
            if (typeof c !== "string" || id !== c.split("_")[0]) {
                throw new IInsightFacade_1.InsightError("Invalid format");
            }
            if (type === "courses") {
                (0, DatasetKeyUtil_1.checkValidKey)(c, false, customKeys);
            }
            else {
                (0, DatasetKeyUtil_1.checkValidRoomKey)(c, false, customKeys);
            }
        });
    }
    if (order) {
        checkValidOrder(order, columns, id);
    }
    return id;
}
function checkValidOrder(order, columns, id) {
    if (typeof order !== "string" && typeof order !== "object") {
        throw new IInsightFacade_1.InsightError("Invalid order format");
    }
    if (typeof order === "string") {
        if (!columns.includes(order)) {
            throw new IInsightFacade_1.InsightError("order key must be in columns");
        }
    }
    else {
        const orderKeys = Object.keys(order);
        if (orderKeys.length !== 2) {
            throw new IInsightFacade_1.InsightError("two keys required in order");
        }
        if (!orderKeys.includes("dir") || !orderKeys.includes("keys")) {
            throw new IInsightFacade_1.InsightError("invalid keys in order");
        }
        if (order.dir !== "DOWN" && order.dir !== "UP") {
            throw new IInsightFacade_1.InsightError("invalid order direction");
        }
        if (!Array.isArray(order.keys) || order.keys.length === 0) {
            throw new IInsightFacade_1.InsightError("order keys must be array of size greater than 0");
        }
        for (let key of order.keys) {
            if (!columns.includes(key)) {
                throw new IInsightFacade_1.InsightError("invalid order key");
            }
        }
    }
}
//# sourceMappingURL=ValidationUtil.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidTransformations = void 0;
const IInsightFacade_1 = require("../IInsightFacade");
const ValidationUtil_1 = require("./ValidationUtil");
function checkValidTransformations(transformations, id, type) {
    const group = transformations.GROUP;
    const apply = transformations.APPLY;
    const applyKeys = [];
    if (typeof apply === "undefined" || typeof group === "undefined") {
        throw new IInsightFacade_1.InsightError("Missing apply or group in transformation");
    }
    if (!Array.isArray(group) || group.length === 0) {
        throw new IInsightFacade_1.InsightError("invalid transformation group");
    }
    if (!Array.isArray(apply)) {
        throw new IInsightFacade_1.InsightError("apply must be array");
    }
    group.forEach((g) => {
        checkValidGroup(g, id, type);
        applyKeys.push(g);
    });
    apply.forEach((a) => {
        checkValidApply(a, applyKeys, id, type);
        applyKeys.push(Object.keys(a)[0]);
    });
    return applyKeys;
}
exports.checkValidTransformations = checkValidTransformations;
function checkValidGroup(group, id, type) {
    let splitKey;
    if (typeof group !== "string") {
        throw new IInsightFacade_1.InsightError("Type of group must be string");
    }
    splitKey = group.split("_");
    if (splitKey.length !== 2) {
        throw new IInsightFacade_1.InsightError("Invalid group key");
    }
    if (splitKey[0] !== id) {
        throw new IInsightFacade_1.InsightError();
    }
    if (type === "courses") {
        (0, ValidationUtil_1.checkValidKey)(group);
    }
    else {
        (0, ValidationUtil_1.checkValidRoomKey)(group);
    }
}
function checkValidApply(apply, applyKeys, id, type) {
    const validApply = ["MAX", "MIN", "AVG", "SUM", "COUNT"];
    const applyKey = Object.keys(apply)[0];
    const applyBody = apply[applyKey];
    let applyRule;
    let applyRuleKey;
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
    if (applyKeys.includes(applyKey)) {
        throw new IInsightFacade_1.InsightError("duplicate apply key");
    }
    applyRule = Object.keys(applyBody)[0];
    applyRuleKey = applyBody[Object.keys(applyBody)[0]];
    if (typeof applyRuleKey !== "string" || applyRuleKey.split("_")[0] !== id) {
        throw new IInsightFacade_1.InsightError("Invalid applyRule Id");
    }
    if (applyRule !== "COUNT") {
        if (type === "courses") {
            (0, ValidationUtil_1.checkValidKey)(applyRuleKey, true);
        }
        else {
            (0, ValidationUtil_1.checkValidRoomKey)(applyRuleKey, true);
        }
    }
    else {
        if (type === "courses") {
            (0, ValidationUtil_1.checkValidKey)(applyRuleKey);
        }
        else {
            (0, ValidationUtil_1.checkValidRoomKey)(applyRuleKey);
        }
    }
}
//# sourceMappingURL=ValidTransformUtil.js.map
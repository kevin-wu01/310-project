"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomKey = exports.getCourseKey = void 0;
function getCourseKey(key) {
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
        default: return key;
    }
    return dataKey;
}
exports.getCourseKey = getCourseKey;
function getRoomKey(key) {
    let dataKey;
    return key;
}
exports.getRoomKey = getRoomKey;
//# sourceMappingURL=DataKeyUtil.js.map
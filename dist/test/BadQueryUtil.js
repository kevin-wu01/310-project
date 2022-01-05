"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwoDatasets = exports.getBadIDQuery = void 0;
function getBadIDQuery() {
    let query;
    query = {
        WHERE: {
            GT: {
                foobar: 97
            }
        },
        OPTIONS: {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg"
        }
    };
    return ({ query, path: "courses.zip", resultObject: [] });
}
exports.getBadIDQuery = getBadIDQuery;
function getTwoDatasets() {
    let query;
    query = {
        WHERE: {
            AND: [
                {
                    GT: {
                        courses_avg: 97
                    }
                },
                {
                    GT: {
                        ct_avg: 90
                    }
                }
            ]
        },
        OPTIONS: {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg"
        }
    };
    return ({ query, path: "courses.zip", resultObject: [] });
}
exports.getTwoDatasets = getTwoDatasets;
//# sourceMappingURL=BadQueryUtil.js.map
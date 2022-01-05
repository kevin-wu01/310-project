"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getORQuery = exports.getWildcardQuery = exports.getGTQuery = void 0;
const resultObject1 = [{ courses_dept: "hist", courses_avg: 34, courses_audit: 0, courses_pass: 1, courses_fail: 1,
        courses_year: 2009, courses_uuid: "14375", courses_instructor: "gossen, david", courses_title: "hist 1500 - 20 c",
        courses_id: "102" }, { courses_dept: "busi", courses_avg: 4, courses_audit: 0, courses_pass: 0, courses_fail: 1,
        courses_year: 1900, courses_uuid: "16428", courses_instructor: "", courses_title: "found re apprai",
        courses_id: "330" }, { courses_dept: "wood", courses_avg: 1, courses_audit: 0, courses_pass: 0, courses_fail: 2,
        courses_year: 1900, courses_uuid: "49835", courses_instructor: "", courses_title: "prpty,ident&uses",
        courses_id: "475" }, { courses_dept: "phil", courses_avg: 33.2, courses_audit: 0, courses_pass: 5, courses_fail: 5,
        courses_year: 2008, courses_uuid: "51675", courses_instructor: "", courses_title: "log & crit think",
        courses_id: "120" }, { courses_dept: "lfs", courses_avg: 0, courses_audit: 0, courses_pass: 0, courses_fail: 1,
        courses_year: 2009, courses_uuid: "56402", courses_instructor: "", courses_title: "in land food com",
        courses_id: "100" }, { courses_dept: "lfs", courses_avg: 0, courses_audit: 0, courses_pass: 0, courses_fail: 1,
        courses_year: 1900, courses_uuid: "56403", courses_instructor: "", courses_title: "in land food com",
        courses_id: "100" }, { courses_dept: "frst", courses_avg: 0, courses_audit: 0, courses_pass: 0, courses_fail: 1,
        courses_year: 1900, courses_uuid: "89536", courses_instructor: "", courses_title: "forest ecology",
        courses_id: "202" }];
const resultObject2 = [{ courses_dept: "eosc", courses_avg: 72.46, courses_pass: 2016, courses_id: "114" },
    { courses_dept: "eosc", courses_avg: 73.39, courses_pass: 2015, courses_id: "114" }];
const resultObject3 = [{ courses_dept: "busi", courses_avg: 4 }, { courses_dept: "chem", courses_avg: 53 }];
const resultObject4 = [{ courses_dept: "comm", courses_avg: 74.05, courses_pass: 697 },
    { courses_dept: "comm", courses_avg: 74.84, courses_pass: 637 },
    { courses_dept: "apsc", courses_avg: 75.53, courses_pass: 537 },
    { courses_dept: "comm", courses_avg: 75.77, courses_pass: 788 },
    { courses_dept: "apsc", courses_avg: 79.43, courses_pass: 522 },
    { courses_dept: "apsc", courses_avg: 82.13, courses_pass: 718 }];
const query1 = {
    WHERE: {
        AND: [
            {
                IS: {
                    courses_dept: "*"
                }
            },
            {
                GT: {
                    courses_pass: 500
                }
            },
            {
                LT: {
                    courses_fail: 1
                }
            },
            {
                OR: [
                    {
                        GT: {
                            courses_pass: 500
                        }
                    },
                    {
                        GT: {
                            courses_fail: 500
                        }
                    },
                    {
                        AND: [
                            {
                                GT: {
                                    courses_pass: 1900
                                }
                            },
                            {
                                GT: {
                                    courses_fail: 2000
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    OPTIONS: {
        COLUMNS: [
            "courses_dept",
            "courses_avg",
            "courses_pass"
        ],
        ORDER: "courses_avg"
    }
};
function getGTQuery() {
    let query;
    query = {
        WHERE: {},
        OPTIONS: {
            COLUMNS: [
                "courses_dept",
                "courses_avg",
                "courses_audit",
                "courses_pass",
                "courses_fail",
                "courses_year",
                "courses_uuid",
                "courses_instructor",
                "courses_title",
                "courses_id"
            ],
            ORDER: "courses_uuid"
        }
    };
    return ({ query, path: "courses.zip", resultObject: resultObject1 });
}
exports.getGTQuery = getGTQuery;
function getWildcardQuery() {
    let query;
    query = {
        WHERE: {
            AND: [
                {
                    IS: {
                        courses_dept: "eos*"
                    }
                },
                {
                    GT: {
                        courses_pass: 2000
                    }
                }
            ]
        },
        OPTIONS: {
            COLUMNS: [
                "courses_dept",
                "courses_avg",
                "courses_pass",
                "courses_id"
            ],
            ORDER: "courses_avg"
        }
    };
    return ({ query, path: "courses.zip", resultObject: resultObject2 });
}
exports.getWildcardQuery = getWildcardQuery;
function getORQuery() {
    let query;
    query = query1;
    return ({ query, path: "courses.zip", resultObject: resultObject4 });
}
exports.getORQuery = getORQuery;
//# sourceMappingURL=MoreQueryUtil.js.map
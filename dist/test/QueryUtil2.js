"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomQuery = exports.getOrderQuery = exports.getWeirdQuery = void 0;
const query1 = {
    WHERE: {},
    OPTIONS: {
        COLUMNS: [
            "courses_title",
            "overallAvg"
        ]
    },
    TRANSFORMATIONS: {
        GROUP: [
            "courses_title"
        ],
        APPLY: [
            {
                overallAvg: {
                    AVG: "courses_avg"
                }
            }
        ]
    }
};
const query2 = {
    WHERE: {},
    OPTIONS: {
        COLUMNS: [
            "courses_title",
            "overallAvg"
        ],
        ORDER: "overallAvg"
    },
    TRANSFORMATIONS: {
        GROUP: [
            "courses_title"
        ],
        APPLY: [
            {
                overallAvg: {
                    SUM: "courses_audit"
                }
            }
        ]
    }
};
const query3 = {
    WHERE: {
        AND: [
            {
                IS: {
                    rooms_furniture: "*Tables*"
                }
            },
            {
                GT: {
                    rooms_seats: 300
                }
            }
        ]
    },
    OPTIONS: {
        COLUMNS: [
            "rooms_shortname",
            "maxSeats"
        ],
        ORDER: {
            dir: "DOWN",
            keys: [
                "maxSeats"
            ]
        }
    },
    TRANSFORMATIONS: {
        GROUP: [
            "rooms_shortname"
        ],
        APPLY: [
            {
                maxSeats: {
                    MAX: "rooms_seats"
                }
            }
        ]
    }
};
const resultObject1 = [{}];
const resultObject2 = [{}];
const resultObject3 = [{ rooms_shortname: "OSBO", maxSeats: 442 }, { rooms_shortname: "HEBB", maxSeats: 375 },
    { rooms_shortname: "LSC", maxSeats: 350 }];
function getWeirdQuery() {
    let query;
    query = query1;
    return ({ query, path: "courses.zip", resultObject: resultObject1 });
}
exports.getWeirdQuery = getWeirdQuery;
function getOrderQuery() {
    let query;
    query = query2;
    return ({ query, path: "courses.zip", resultObject: resultObject2 });
}
exports.getOrderQuery = getOrderQuery;
function getRoomQuery() {
    let query;
    query = query3;
    return ({ query, path: "rooms.zip", resultObject: resultObject3 });
}
exports.getRoomQuery = getRoomQuery;
//# sourceMappingURL=QueryUtil2.js.map
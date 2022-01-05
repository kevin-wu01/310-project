"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("../../src/rest/Server"));
const InsightFacade_1 = __importDefault(require("../../src/controller/InsightFacade"));
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const fs = __importStar(require("fs"));
const query = {
    WHERE: {
        AND: [
            {
                IS: {
                    courses_dept: "*c*"
                }
            },
            {
                GT: {
                    courses_avg: 92
                }
            }
        ]
    },
    OPTIONS: {
        COLUMNS: [
            "courses_dept",
            "courses_avg",
            "courses_pass",
            "countInstruct",
            "maxAvg"
        ],
        ORDER: {
            dir: "UP",
            keys: [
                "maxAvg",
                "courses_dept",
                "courses_pass"
            ]
        }
    },
    TRANSFORMATIONS: {
        GROUP: [
            "courses_dept",
            "courses_avg",
            "courses_pass"
        ],
        APPLY: [
            {
                maxAvg: {
                    MAX: "courses_avg"
                }
            },
            {
                countInstruct: {
                    COUNT: "courses_instructor"
                }
            }
        ]
    }
};
const resultData = { result: [] };
describe("Facade D3", function () {
    let facade;
    let server;
    (0, chai_1.use)(chai_http_1.default);
    before(function () {
        facade = new InsightFacade_1.default();
        server = new Server_1.default(4321);
        server.start();
    });
    after(function () {
        server.stop();
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("PUT test for courses dataset", function () {
        let SERVER_URL = "http://localhost:4321";
        let ENDPOINT_URL = "/dataset/courses/courses";
        let ZIP_FILE_DATA = fs.readFileSync("./test/data/courses.zip");
        try {
            chai_1.default.request(SERVER_URL)
                .put(ENDPOINT_URL)
                .send(ZIP_FILE_DATA)
                .set("Content-Type", "application/x-zip-compressed")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
        SERVER_URL = "http://localhost:4321";
        ENDPOINT_URL = "/dataset/courses";
        try {
            chai_1.default.request(SERVER_URL)
                .delete(ENDPOINT_URL)
                .set("Content-Type", "application/json")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
        SERVER_URL = "http://localhost:4321";
        ENDPOINT_URL = "/datasets";
        try {
            chai_1.default.request(SERVER_URL)
                .get(ENDPOINT_URL)
                .set("Content-Type", "application/json")
                .then(function (res) {
                console.log(res.body, "added datasets");
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
        SERVER_URL = "http://localhost:4321";
        ENDPOINT_URL = "/dataset/courses/courses";
        ZIP_FILE_DATA = fs.readFileSync("./test/data/courses.zip");
        try {
            return chai_1.default.request(SERVER_URL)
                .put(ENDPOINT_URL)
                .send(ZIP_FILE_DATA)
                .set("Content-Type", "application/x-zip-compressed")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
    });
    it("GET datasets", function () {
        const SERVER_URL = "http://localhost:4321";
        const ENDPOINT_URL = "/datasets";
        try {
            return chai_1.default.request(SERVER_URL)
                .get(ENDPOINT_URL)
                .set("Content-Type", "application/json")
                .then(function (res) {
                console.log(res.body, "added datasets");
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
    });
    it("DELETE dataset", function () {
        const SERVER_URL = "http://localhost:4321";
        let ENDPOINT_URL = "/dataset/ubc";
        try {
            chai_1.default.request(SERVER_URL)
                .delete(ENDPOINT_URL)
                .set("Content-Type", "application/json")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
        ENDPOINT_URL = "/datasets";
        try {
            return chai_1.default.request(SERVER_URL)
                .get(ENDPOINT_URL)
                .set("Content-Type", "application/json")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
    });
    it("POST query", function () {
        const SERVER_URL = "http://localhost:4321";
        const ENDPOINT_URL = "/query";
        try {
            return chai_1.default.request(SERVER_URL)
                .post(ENDPOINT_URL)
                .send(query)
                .set("Content-Type", "application/json")
                .then(function (res) {
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.eql(resultData);
                for (let idx = 0; idx < res.body.result.length; idx++) {
                    (0, chai_1.expect)(res.body.result[idx]).to.eql(resultData.result[idx]);
                }
            })
                .catch(function (err) {
                console.log(err, "err1");
                chai_1.expect.fail();
            });
        }
        catch (err) {
            console.log(err, "err2");
        }
    });
});
//# sourceMappingURL=Server.spec.js.map
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
const chai_1 = require("chai");
const InsightFacade_1 = __importDefault(require("../../src/controller/InsightFacade"));
const IInsightFacade_1 = require("../../src/controller/IInsightFacade");
const fs = __importStar(require("fs-extra"));
const TestUtil_1 = require("../TestUtil");
const QueryUtil_1 = require("../QueryUtil");
const MoreQueryUtil_1 = require("../MoreQueryUtil");
const TransformQueryTestUtil_1 = require("../TransformQueryTestUtil");
const QueryUtil2_1 = require("../QueryUtil2");
describe("InsightFacade", function () {
    let courses;
    let rooms;
    before(function () {
        courses = (0, TestUtil_1.getContentFromArchives)("courses.zip");
        rooms = (0, TestUtil_1.getContentFromArchives)("rooms.zip");
        for (const key of Object.keys(datasetsToLoad)) {
            const content = fs.readFileSync(datasetsToLoad[key]).toString("base64");
            datasetContents.set(key, content);
        }
        fs.removeSync(persistDir);
    });
    const persistDir = "./data";
    const datasetContents = new Map();
    const datasetsToLoad = {
        courses: "./test/resources/archives/courses.zip",
    };
    describe("Query Datasets", function () {
        let facade = new InsightFacade_1.default();
        let queries = (0, TestUtil_1.getQueries)();
        let response;
        let query;
        beforeEach(async function () {
            (0, TestUtil_1.clearDisk)();
            facade = new InsightFacade_1.default();
            response = [];
            courses = "";
        });
        it("query weird", async function () {
            try {
                query = (0, QueryUtil2_1.getWeirdQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
                for (let idx = 0; idx < response.length; idx++) {
                    chai_1.assert.deepEqual(response[idx], query.resultObject[idx]);
                }
                console.log(response, "response");
            }
            catch (e) {
                console.log(e, "error");
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query room dataset", async function () {
            try {
                query = (0, QueryUtil2_1.getRoomQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("rooms", courses, IInsightFacade_1.InsightDatasetKind.Rooms);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
            }
            catch (e) {
                console.log(e, "e");
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query order object", async function () {
            try {
                query = (0, QueryUtil2_1.getOrderQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
                for (let idx = 0; idx < response.length; idx++) {
                    chai_1.assert.deepEqual(response[idx], query.resultObject[idx]);
                }
                console.log(response, "response");
            }
            catch (e) {
                console.log(e, "error");
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query valid transform", async function () {
            try {
                query = (0, TransformQueryTestUtil_1.getInvalidTransformation)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
                for (let idx = 0; idx < response.length; idx++) {
                    chai_1.assert.deepEqual(response[idx], query.resultObject[idx]);
                }
            }
            catch (e) {
                console.log(e, "error");
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query wildcard IS", async function () {
            try {
                query = (0, MoreQueryUtil_1.getWildcardQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
            }
            catch (e) {
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query LT comparator", async function () {
            try {
                query = (0, MoreQueryUtil_1.getGTQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.ResultTooLargeError);
            }
        });
        it("run working queries", async function () {
            for (let queryItem of queries) {
                try {
                    courses = (0, TestUtil_1.getContentFromArchives)(queryItem.path);
                    await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                    response = await facade.performQuery(queryItem.query);
                    (0, chai_1.expect)(response).to.have.length(queryItem.resultObject.length);
                    (0, chai_1.expect)(response).to.have.deep.members(queryItem.resultObject);
                }
                catch (e) {
                    chai_1.assert.fail("query failed to run");
                }
                finally {
                    (0, TestUtil_1.clearDisk)();
                    facade = new InsightFacade_1.default();
                }
            }
        });
        it("query OR comparator", async function () {
            try {
                query = (0, MoreQueryUtil_1.getORQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
            }
            catch (e) {
                console.log(e);
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query NOT comparator", async function () {
            try {
                query = (0, QueryUtil_1.getNOTQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                (0, chai_1.expect)(response).to.have.length(query.resultObject.length);
                (0, chai_1.expect)(response).to.have.deep.members(query.resultObject);
            }
            catch (e) {
                chai_1.assert.fail("query failed to run");
            }
        });
        it("query result too large", async function () {
            try {
                query = (0, TestUtil_1.getQueryTooLarge)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("too large query ran successfully");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.ResultTooLargeError);
            }
        });
        it("query incorrect format", async function () {
            try {
                query = (0, TestUtil_1.getInvalidQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("incorrect format query ran successfully");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
        it("query multiple datasets", async function () {
            try {
                query = (0, TestUtil_1.getSimpleQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                await facade.addDataset("courses2", "courses2.zip", IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("queried multiple datasets");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
        it("query non-existent dataset", async function () {
            try {
                query = (0, TestUtil_1.getSimpleQuery)();
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("queried empty dataset");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
        it("query non-existent property", async function () {
            try {
                query = (0, TestUtil_1.getBadPropertyQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("queried non-existent property");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
        it("query bad id", async function () {
            try {
                query = (0, QueryUtil_1.getBadIDQuery)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("queried bad id");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
        it("query two datasets", async function () {
            try {
                query = (0, QueryUtil_1.getTwoDatasets)();
                courses = (0, TestUtil_1.getContentFromArchives)(query.path);
                await facade.addDataset("courses", courses, IInsightFacade_1.InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                chai_1.assert.fail("queried two datasets");
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(IInsightFacade_1.InsightError);
            }
        });
    });
});
//# sourceMappingURL=InsightFacade.spec.js.map
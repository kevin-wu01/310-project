"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const InsightFacade_1 = __importDefault(require("../controller/InsightFacade"));
const TestUtil_1 = require("../../test/TestUtil");
const IInsightFacade_1 = require("../controller/IInsightFacade");
class Server {
    constructor(port) {
        console.info(`Server::<init>( ${port} )`);
        this.port = port;
        this.express = (0, express_1.default)();
        this.registerMiddleware();
        this.registerRoutes();
        this.facade = new InsightFacade_1.default();
        this.addDefaultDatasets();
        this.addUBCDatasets();
        this.express.use(express_1.default.static("./frontend/public"));
    }
    start() {
        return new Promise((resolve, reject) => {
            console.info("Server::start() - start");
            if (this.server !== undefined) {
                console.error("Server::start() - server already listening");
                reject();
            }
            else {
                this.server = this.express.listen(this.port, () => {
                    console.info(`Server::start() - server listening on port: ${this.port}`);
                    resolve();
                }).on("error", (err) => {
                    console.error(`Server::start() - server ERROR: ${err.message}`);
                    reject(err);
                });
            }
        });
    }
    stop() {
        console.info("Server::stop()");
        return new Promise((resolve, reject) => {
            if (this.server === undefined) {
                console.error("Server::stop() - ERROR: server not started");
                reject();
            }
            else {
                this.server.close(() => {
                    console.info("Server::stop() - server closed");
                    resolve();
                });
            }
        });
    }
    registerMiddleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.raw({ type: "application/*", limit: "10mb" }));
        this.express.use((0, cors_1.default)());
    }
    registerRoutes() {
        this.express.put("/dataset/:id/:kind", (req, res) => {
            this.addDataset(req.body, req.params.id, req.params.kind).then((result) => {
                res.status(200).json({ result });
            }).catch((e) => {
                console.log(e, "err");
                res.status(400).json({ error: "an error occurred" });
            });
        });
        this.express.get("/datasets", (req, res) => {
            this.getDatasets().then((result) => {
                res.status(200).json({ result });
            }).catch((e) => {
                res.status(400).json({ error: "an error occurred" });
            });
        });
        this.express.delete("/dataset/:id", (req, res) => {
            this.deleteDataset(req.params.id).then((id) => {
                res.status(200).json({ result: id });
            }).catch((e) => {
                if (e instanceof IInsightFacade_1.NotFoundError) {
                    res.status(404).json({ error: "id not added yet" });
                }
                else {
                    res.status(400).json({ error: "an error occurred" });
                }
            });
        });
        this.express.post("/query", (req, res) => {
            this.queryData(req.body).then((result) => {
                res.status(200).json({ result });
            }).catch((e) => {
                if (e instanceof IInsightFacade_1.ResultTooLargeError) {
                    res.status(400).json({ error: "result is greater than 4000" });
                }
                else {
                    res.status(400).json({ error: "an error occurred" });
                }
            });
        });
    }
    static echo(req, res) {
        try {
            console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
            const response = Server.performEcho(req.params.msg);
            res.status(200).json({ result: response });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    }
    static performEcho(msg) {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        }
        else {
            return "Message not provided";
        }
    }
    async addDefaultDatasets() {
        await this.facade.addDataset("sfu", (0, TestUtil_1.getContentFromArchives)("courses.zip"), IInsightFacade_1.InsightDatasetKind.Courses);
    }
    async addUBCDatasets() {
        await this.facade.addDataset("ubc", (0, TestUtil_1.getContentFromArchives)("courses.zip"), IInsightFacade_1.InsightDatasetKind.Courses);
    }
    async getDatasets() {
        let datasets = await this.facade.listDatasets();
        return datasets;
    }
    async queryData(query) {
        let data = await this.facade.performQuery(query);
        return data;
    }
    async deleteDataset(id) {
        await this.facade.removeDataset(id);
        return id;
    }
    async addDataset(data, id, kind) {
        let datasetKind = kind === "courses" ? IInsightFacade_1.InsightDatasetKind.Courses : IInsightFacade_1.InsightDatasetKind.Rooms;
        let addedIds = await this.facade.addDataset(id, Buffer.from(data).toString("base64"), datasetKind);
        return addedIds;
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map
import express, {Application, Request, Response} from "express";
import * as http from "http";
import cors from "cors";
import InsightFacade from "../controller/InsightFacade";
import {getContentFromArchives} from "../../test/TestUtil";
import {InsightDatasetKind, InsightError, NotFoundError, ResultTooLargeError} from "../controller/IInsightFacade";

export default class Server {
	private readonly port: number;
	private express: Application;
	private server: http.Server | undefined;
	private facade: InsightFacade;

	constructor(port: number) {
		console.info(`Server::<init>( ${port} )`);
		this.port = port;
		this.express = express();

		this.registerMiddleware();
		this.registerRoutes();
		this.facade = new InsightFacade();
		this.addDefaultDatasets();
		this.addUBCDatasets();
		// NOTE: you can serve static frontend files in from your express server
		// by uncommenting the line below. This makes files in ./frontend/public
		// accessible at http://localhost:<port>/
		this.express.use(express.static("./frontend/public"));
	}

	/**
	 * Starts the server. Returns a promise that resolves if success. Promises are used
	 * here because starting the server takes some time and we want to know when it
	 * is done (and if it worked).
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			console.info("Server::start() - start");
			if (this.server !== undefined) {
				console.error("Server::start() - server already listening");
				reject();
			} else {
				this.server = this.express.listen(this.port, () => {
					console.info(`Server::start() - server listening on port: ${this.port}`);
					resolve();
				}).on("error", (err: Error) => {
					// catches errors in server start
					console.error(`Server::start() - server ERROR: ${err.message}`);
					reject(err);
				});
			}
		});
	}

	/**
	 * Stops the server. Again returns a promise so we know when the connections have
	 * actually been fully closed and the port has been released.
	 *
	 * @returns {Promise<void>}
	 */
	public stop(): Promise<void> {
		console.info("Server::stop()");
		return new Promise((resolve, reject) => {
			if (this.server === undefined) {
				console.error("Server::stop() - ERROR: server not started");
				reject();
			} else {
				this.server.close(() => {
					console.info("Server::stop() - server closed");
					resolve();
				});
			}
		});
	}

	// Registers middleware to parse request before passing them to request handlers
	private registerMiddleware() {
		// JSON parser must be place before raw parser because of wildcard matching done by raw parser below
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		// enable cors in request headers to allow cross-origin HTTP requests
		this.express.use(cors());
	}

	// Registers all request handlers to routes
	private registerRoutes() {
		// this.express.get("/echo/:msg", Server.echo);
		this.express.put("/datasets/:id/:kind", (req, res) => {
			console.log("PUT /datasets/:id/:kind");
			this.addDataset(req.body, req.params.id, req.params.kind).then((result) => {
				res.status(200).json({result});
			}).catch((e) => {
				console.log(e, "err");
				res.status(400).json({error: "an error occurred"});
			});
		});

		this.express.get("/datasets", (req, res) => {
			console.log("GET /datasets");
			this.getDatasets().then((result) => {
				res.status(200).json({result});
			}).catch((e) => {
				res.status(400).json({error: "an error occurred"});
			});
		});

		this.express.delete("/datasets/:id", (req, res) => {
			console.log("DELETE /datasets/:id");
			this.deleteDataset(req.params.id).then((id) => {
				res.status(200).json({result: id});
			}).catch((e) => {
				if (e instanceof NotFoundError) {
					res.status(404).json({error: "id not added yet"});
				} else {
					res.status(400).json({error: "an error occurred"});
				}
			});
		});

		this.express.post("/query", (req, res) => {
			console.log("POST /query");
			this.queryData(req.body).then((result) => {
				res.status(200).json({result});
			}).catch((e) => {
				if (e instanceof ResultTooLargeError) {
					res.status(400).json({error: "result is greater than 4000"});
				} else {
					res.status(400).json({error: "an error occurred"});
				}
			});
		});
	}

	// The next two methods handle the echo service.
	// These are almost certainly not the best place to put these, but are here for your reference.
	// By updating the Server.echo function pointer above, these methods can be easily moved.
	private static echo(req: Request, res: Response) {
		try {
			console.log(`Server::echo(..) - params: ${JSON.stringify(req.params)}`);
			const response = Server.performEcho(req.params.msg);
			res.status(200).json({result: response});
		} catch (err) {
			res.status(400).json({error: err});
		}
	}

	private static performEcho(msg: string): string {
		if (typeof msg !== "undefined" && msg !== null) {
			return `${msg}...${msg}`;
		} else {
			return "Message not provided";
		}
	}

	private async addDefaultDatasets(): Promise<void> {
		await this.facade.addDataset("sfu", getContentFromArchives("courses.zip"), InsightDatasetKind.Courses);
	}

	private async addUBCDatasets(): Promise<void> {
		await this.facade.addDataset("ubc", getContentFromArchives("courses.zip"), InsightDatasetKind.Courses);
	}

	private async getDatasets(): Promise<any[]> {
		let datasets = await this.facade.listDatasets();
		return datasets;
	}

	private async queryData(query: any): Promise<any[]> {
		let data = await this.facade.performQuery(query);
		return data;
	}

	private async deleteDataset(id: any): Promise<string> {
		await this.facade.removeDataset(id);

		return id;
	}

	private async addDataset(data: any, id: string, kind: string): Promise<string[]> {
		let datasetKind = kind === "courses" ? InsightDatasetKind.Courses : InsightDatasetKind.Rooms;

		let addedIds = await this.facade.addDataset(id, Buffer.from(data).toString("base64"), datasetKind);

		return addedIds;
	}
}

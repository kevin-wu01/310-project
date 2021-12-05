import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";

import chaiHttp from "chai-http";
import * as fs from "fs";

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

const resultData = {result: []};

describe("Facade D3", function () {

	let facade: InsightFacade;
	let server: Server;

	use(chaiHttp);

	before(function () {
		facade = new InsightFacade();
		server = new Server(4321);
		// TODO: start server here once and handle errors properly
		server.start();
	});

	after(function () {
		// TODO: stop server here once!
		server.stop();
	});

	beforeEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	afterEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	// Sample on how to format PUT requests

	it("PUT test for courses dataset", function () {
		let SERVER_URL = "http://localhost:4321";
		let ENDPOINT_URL = "/datasets/courses/courses";
		let ZIP_FILE_DATA = fs.readFileSync("./test/data/courses.zip");

		try {
			chai.request(SERVER_URL)
				.put(ENDPOINT_URL)
				.send(ZIP_FILE_DATA)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res) {
					// some logging here please!
					// console.log(res.body, "res");
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}

		SERVER_URL = "http://localhost:4321";
		ENDPOINT_URL = "/datasets/courses";

		try {
			chai.request(SERVER_URL)
				.delete(ENDPOINT_URL)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!;
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}

		SERVER_URL = "http://localhost:4321";
		ENDPOINT_URL = "/datasets";

		try {
			chai.request(SERVER_URL)
				.get(ENDPOINT_URL)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!
					console.log(res.body, "added datasets");
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}

		SERVER_URL = "http://localhost:4321";
		ENDPOINT_URL = "/datasets/courses/courses";
		ZIP_FILE_DATA = fs.readFileSync("./test/data/courses.zip");

		try {
			return chai.request(SERVER_URL)
				.put(ENDPOINT_URL)
				.send(ZIP_FILE_DATA)
				.set("Content-Type", "application/x-zip-compressed")
				.then(function (res) {
					// some logging here please!
					// console.log(res.body, "res");
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}
	});


	it("GET datasets", function () {
		const SERVER_URL = "http://localhost:4321";
		const ENDPOINT_URL = "/datasets";

		try {
			return chai.request(SERVER_URL)
				.get(ENDPOINT_URL)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!
					console.log(res.body, "added datasets");
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}
	});

	it("DELETE dataset", function () {
		const SERVER_URL = "http://localhost:4321";
		let ENDPOINT_URL = "/datasets/ubc";

		try {
			chai.request(SERVER_URL)
				.delete(ENDPOINT_URL)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!;
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}

		ENDPOINT_URL = "/datasets";

		try {
			return chai.request(SERVER_URL)
				.get(ENDPOINT_URL)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!
					expect(res.status).to.be.equal(200);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}
	});

	it("POST query", function () {
		const SERVER_URL = "http://localhost:4321";
		const ENDPOINT_URL = "/query";

		try {
			return chai.request(SERVER_URL)
				.post(ENDPOINT_URL)
				.send(query)
				.set("Content-Type", "application/json")
				.then(function (res) {
					// some logging here please!
					// console.log(res.body, "res");
					expect(res.status).to.be.equal(200);
					expect(res.body).to.eql(resultData);

					for (let idx = 0; idx < res.body.result.length; idx++){
						expect(res.body.result[idx]).to.eql(resultData.result[idx]);
					}
					// expect(res.body.result).to.have.members(resultData.result);
					// expect(res.body.result).to.have.ordered.members(resultData.result);
				})
				.catch(function (err) {
					// some logging here please!
					console.log(err, "err1");
					expect.fail();
				});
		} catch (err) {
			console.log(err, "err2");
			// and some more logging here!
		}
	});


	// The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
});

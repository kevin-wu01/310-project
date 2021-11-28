import Server from "../../src/rest/Server";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect, use} from "chai";

import chaiHttp from "chai-http";
import * as fs from "fs";

describe("Facade D3", function () {

	let facade: InsightFacade;
	let server: Server;

	use(chaiHttp);

	before(function () {
		facade = new InsightFacade();
		server = new Server(4321);
		// TODO: start server here once and handle errors properly
	});

	after(function () {
		// TODO: stop server here once!
	});

	beforeEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	afterEach(function () {
		// might want to add some process logging here to keep track of what"s going on
	});

	// Sample on how to format PUT requests

	it("PUT test for courses dataset", function () {
		const SERVER_URL = "http://localhost:4321";
		const ENDPOINT_URL = "/datasets/foo/courses";
		const ZIP_FILE_DATA = fs.readFileSync("./test/data/courses.zip");

		try {
			return chai.request(SERVER_URL)
				.put(ENDPOINT_URL)
				.send(ZIP_FILE_DATA)
				.set("Content-Type", "application/x-zip-compressed")
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

	it("GET datasets", function () {
		const SERVER_URL = "http://localhost:4321";
		const ENDPOINT_URL = "/datasets";

		try {
			return chai.request(SERVER_URL)
				.get(ENDPOINT_URL)
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


	// The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
});

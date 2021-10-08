import { expect, use, assert } from 'chai';
import InsightFacade from "../../src/controller/InsightFacade";
import {IInsightFacade, InsightDatasetKind, InsightDataset, InsightError, NotFoundError, ResultTooLargeError} from "../../src/controller/IInsightFacade";
import * as fs from "fs";
import JSZip from 'jszip';
import {Context, Suite} from "mocha";
//import {expect, use} from "chai";
//import chaiAsPromised from "chai-as-promised";
import {getContentFromArchives, clearDisk, persistDir, Query, getQueries,
        getQueryTooLarge, getInvalidQuery, getSimpleQuery, getBadPropertyQuery} from '../TestUtil';

describe("InsightFacade", function(this: Suite) {
    let courses: string;

    before(function() {
        courses = getContentFromArchives("courses.zip");
    })

    describe("List Datasets", function() {
        let facade: IInsightFacade = new InsightFacade();

        beforeEach(function() {
            clearDisk();
            facade = new InsightFacade();
        })

        it("should list no datasets", function (this: Context) {

            return facade.listDatasets().then((insightDatasets) => {
                expect(insightDatasets).to.deep.equal([]);

                expect(insightDatasets).to.be.an.instanceof(Array);
                expect(insightDatasets).to.have.length(0);
            })
/*
            const futureInsightDatasets = facade.listDatasets();
            return expect(futureInsightDatasets).to.eventually.deep.equal([]);
            */
        });

        it("should list one dataset", async function() {
                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
                const insightDatasets = await facade.listDatasets();
                expect(insightDatasets).to.deep.equal([{
                    id: "courses",
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612
                }])
        });

        it("should list multiple datasets", function() {
            return facade.addDataset("courses", courses, InsightDatasetKind.Courses)
                .then(() => {
                    return facade.addDataset("courses-2", courses, InsightDatasetKind.Courses);
                })
                .then(() => {
                    return facade.listDatasets();
                })
                .then((insightDatasets) => {
                /*
                    const expectedDatasets: InsightDataset[] = [
                        {
                            id: "courses",
                            kind: InsightDatasetKind.Courses,
                            numRows: 64612
                        },
                        {
                            id: "courses-2",
                            kind: InsightDatasetKind.Courses,
                            numRows: 64612
                        }
                    ];
                  */
                    expect(insightDatasets).to.be.an.instanceof(Array);
                    //expect(insightDatasets).to.have.deep.members(expectedDatasets);
                    expect(insightDatasets).to.have.length(2);
                    const insightDatasetCourses = insightDatasets.find((dataset) => dataset.id === "courses");
                    expect(insightDatasetCourses).to.exist;
                    expect(insightDatasetCourses).to.deep.equal({
                        id: "courses",
                        kind: InsightDatasetKind.Courses,
                        numRows: 64612
                    })

                })
        });
    });

    describe("Add Datasets", function() {
        let facade: IInsightFacade = new InsightFacade();
        let errorString: string = "";

        beforeEach(function() {
            clearDisk();
            facade = new InsightFacade();
            errorString = "";
        });

        it("add dataset with underscore id", async function() {
            try {
                await facade.addDataset("courses_", courses, InsightDatasetKind.Courses);
                assert.fail("added dataset with underscore id");
            } catch(e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("add dataset with whitespace id", async function() {
            try {
                await facade.addDataset(" ", courses, InsightDatasetKind.Courses);
                assert.fail("added dataset with whitespace id");
            } catch(e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("add dataset with duplicate id", async function() {
        /*
            return facade.addDataset("courses", courses, InsightDatasetKind.Courses)
                        .then(() => {
                            return facade.addDataset("courses", courses, InsightDatasetKind.Courses);
                        })
                        .then(() => {
                            return facade.listDatasets();
                        })
                        .then((insightDatasets) => {
                        console.log("insightDatasets", insightDatasets);
                            expect(insightDatasets).to.be.an.instanceof(Array);
                            expect(insightDatasets).to.have.length(1);
                        })
                        */
            //let addedDatasets: InsightDataset[];

            await facade.addDataset("courses", courses, InsightDatasetKind.Courses);

            try {
                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
                assert.fail("added course with duplicate id");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
/*
            addedDatasets = await facade.listDatasets();

            expect(addedDatasets).to.be.an.instanceof(Array);
            expect(addedDatasets).to.have.length(1);
            */
        })

        it("add text file dataset", async function() {
            try {
                let coursesText: string = getContentFromArchives("coursestxt.txt");

                await facade.addDataset("coursesText", coursesText, InsightDatasetKind.Courses);
                assert.fail("invalid file added");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("add room dataset", async function() {
            try {
                await facade.addDataset("rooms", courses, InsightDatasetKind.Rooms);
                assert.fail("added rooms dataset");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })
    })

    describe("Remove Datasets", function() {
        let facade: IInsightFacade = new InsightFacade();
        let response: string;
        let remainingDatasets: InsightDataset[];

        beforeEach(async function() {
            clearDisk();
            facade = new InsightFacade();
            response = "";
            remainingDatasets = [];

            await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
            await facade.addDataset("courses-2", courses, InsightDatasetKind.Courses);
            await facade.addDataset("courses-3", courses, InsightDatasetKind.Courses);
        })
        
        it("Remove dataset", async function() {
            try {
                response = await facade.removeDataset("courses");
            } catch (e) {
                assert.fail("failed to remove dataset");
            }

            expect(response).to.deep.equal("courses");
        })
        //datasetId 
        it("Remove multiple datasets", async function() {
            try {
                response = await facade.removeDataset("courses");
                expect(response).to.deep.equal("courses");

                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(2);
                expect(remainingDatasets[0].id).to.deep.equal("courses-2");

                response = await facade.removeDataset("courses-3");
                expect(response).to.deep.equal("courses-3");

                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(1);
                expect(remainingDatasets[0].id).to.deep.equal("courses-2");

                response = await facade.removeDataset("courses-2");
                expect(response).to.deep.equal("courses-2");

                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(0);
            } catch (e) {
                assert.fail("failed to remove multiple datasets");
            }
        })

        it("Remove non-existent dataset", async function() {
            try {
                response = await facade.removeDataset("turkey");
                assert.fail("removed non-existent dataset");
            } catch(e) {
                expect(e).to.be.instanceOf(NotFoundError);
            } finally {
                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(3);
            }
        })

        it("Remove whitespace id", async function() {
            try {
                response = await facade.removeDataset(" ");
                assert.fail("removed whitespace id");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            } finally {
                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(3);
            }
        })

        it("Remove underscore id", async function() {
            try {
                response = await facade.removeDataset("courses_");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            } finally {
                remainingDatasets = await facade.listDatasets();
                expect(remainingDatasets).to.have.length(3);
            }
        })
    })

    describe("Query Datasets", function() {
        let facade: IInsightFacade = new InsightFacade();
        let queries: Query[] = getQueries();
        let response: any[];
        let courses: string;
        let query: Query;

        beforeEach(async function() {
            clearDisk();
            facade = new InsightFacade();
            response = [];
            courses = "";
        })

        it("run working queries", async function () {
            for (let i = 0; i < queries.length; i++) {
                try {
                    courses = getContentFromArchives(queries[i].path);
                    await facade.addDataset("courses", courses, InsightDatasetKind.Courses);

                    response = await facade.performQuery(queries[i].query);
                    expect(response).to.have.length(queries[i].resultObject.length);
                    expect(response).to.have.deep.members(queries[i].resultObject);
                } catch (e) {
                    assert.fail("query failed to run");
                } finally {
                    clearDisk();
                    facade = new InsightFacade();
                }
            }
        })

        it("query result too large", async function() {
            try {
                let query = getQueryTooLarge();
                courses = getContentFromArchives(query.path);
                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);

                response = await facade.performQuery(query.query);
                assert.fail("too large query ran successfully");
            } catch (e) {
                expect(e).to.be.instanceOf(ResultTooLargeError);
            }
        })

        it("query incorrect format", async function() {
            try {
                query = getInvalidQuery();
                courses = getContentFromArchives(query.path);

                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);

                response = await facade.performQuery(query.query);
                assert.fail("incorrect format query ran successfully");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("query multiple datasets", async function() {
            try {
                query = getSimpleQuery();
                courses = getContentFromArchives(query.path);

                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
                await facade.addDataset("courses2", "courses2.zip", InsightDatasetKind.Courses);

                response = await facade.performQuery(query.query);
                assert.fail("queried multiple datasets");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("query non-existent dataset", async function() {
            try {
                query = getSimpleQuery();

                response = await facade.performQuery(query.query);
                assert.fail("queried empty dataset");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })

        it("query non-existent property", async function() {
            try {
                query = getBadPropertyQuery();
                courses = getContentFromArchives(query.path);

                await facade.addDataset("courses", courses, InsightDatasetKind.Courses);
                response = await facade.performQuery(query.query);
                assert.fail("queried non-existent property");
            } catch (e) {
                expect(e).to.be.instanceOf(InsightError);
            }
        })
    })
});





/*
describe('addDataset', function() {
    let insightFacade: InsightFacade;
    let classes: string;
    let classesZip = new JSZip();
    const content: string[] = ["foo", "bar"];

    before(function() {
        insightFacade = new InsightFacade();
        //classes = JSON.parse(fs.readFileSync("./test/data/courses.zip", 'utf8'));
        classes = fs.readFileSync("./test/data/courses.zip").toString('base64');

        /*
        fs.readFile("./test/data/courses.zip", function(err, data) {
            if (err) throw err;
            classesZip.loadAsync(data).then(function(zip) {
                zip.forEach(function (path, file) {
                    classes.push(btoa(JSON.stringify(file)));
                })
            })
            console.log(classes);
        })

    })

    it("add valid dataset", async() => {
        const id: string = "foo";
        let response: string[];

            content.forEach(function (val) {
                insightFacade.addDataset(id, val, InsightDatasetKind.Courses).then(function (response) {
                    console.log(response);
                }).catch(function(e) {
                    assert.fail("addDataset fail");
                });
            })
            //response = await insightFacade.addDataset(id, content, InsightDatasetKind.Courses)
    })

    it("add dataset with underscore id", async() => {
        const id: string = "foo_";
        let error: string = "";

        content.forEach(function (val) {
            insightFacade.addDataset(id, val, InsightDatasetKind.Courses).then(function (response) {
                console.log(response);
            }).catch(function(e) {
                error = "error";
            });
        })

        assert.equal(error, "error");
    })

    it("add dataset with whitespace id", async() => {
        const id: string = " ";
        let error: string = "";

        content.forEach(function (val) {
            insightFacade.addDataset(id, val, InsightDatasetKind.Courses).then(function (response) {
                console.log(response);
            }).catch(function(e) {
                error = "error";
            });
        })

        assert.equal(error, "error");
    })


});
*/

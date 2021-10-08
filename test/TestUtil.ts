import * as fs from "fs-extra";

const persistDir = "./data";

export interface Query {
    query: object;
    path: string;
    resultObject: object[];
}

const getContentFromArchives = (name: string): string => {
    return fs.readFileSync(`./test/data/${name}`).toString("base64");
}

function clearDisk(): void {
    fs.removeSync(persistDir);
}

function getQueries(): Query[] {
    let queries: Query[] = [];
    let query: object;
    let path: string;
    let resultObject: object[] = [];

    query = {
                "WHERE":{
                   "GT":{
                      "courses_avg":97
                   }
                },
                "OPTIONS":{
                   "COLUMNS":[
                      "courses_dept",
                      "courses_avg"
                   ],
                   "ORDER":"courses_avg"
                }
            }

    path = "courses.zip";
    resultObject = [{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"educ","courses_avg":97.5},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"epse","courses_avg":97.67},{"courses_dept":"epse","courses_avg":97.69},{"courses_dept":"epse","courses_avg":97.78},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"epse","courses_avg":98.08},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"epse","courses_avg":98.36},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.7},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.8},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"cnps","courses_avg":99.19},{"courses_dept":"math","courses_avg":99.78},{"courses_dept":"math","courses_avg":99.78}];

    queries.push({query, path, resultObject});

    query = {
              "WHERE": {
                "OR": [
                  {
                    "AND": [
                      {
                        "GT": {
                          "courses_avg": 90
                        }
                      },
                      {
                        "IS": {
                          "courses_dept": "adhe"
                        }
                      }
                    ]
                  },
                  {
                    "EQ": {
                      "courses_avg": 95
                    }
                  }
                ]
              },
              "OPTIONS": {
                "COLUMNS": [
                  "courses_dept",
                  "courses_id",
                  "courses_avg"
                ],
                "ORDER": "courses_avg"
              }
            }

    path = "courses.zip";
    resultObject = [{"courses_dept":"adhe","courses_id":"329","courses_avg":90.02},{"courses_dept":"adhe","courses_id":"412","courses_avg":90.16},{"courses_dept":"adhe","courses_id":"330","courses_avg":90.17},{"courses_dept":"adhe","courses_id":"412","courses_avg":90.18},{"courses_dept":"adhe","courses_id":"330","courses_avg":90.5},{"courses_dept":"adhe","courses_id":"330","courses_avg":90.72},{"courses_dept":"adhe","courses_id":"329","courses_avg":90.82},{"courses_dept":"adhe","courses_id":"330","courses_avg":90.85},{"courses_dept":"adhe","courses_id":"330","courses_avg":91.29},{"courses_dept":"adhe","courses_id":"330","courses_avg":91.33},{"courses_dept":"adhe","courses_id":"330","courses_avg":91.33},{"courses_dept":"adhe","courses_id":"330","courses_avg":91.48},{"courses_dept":"adhe","courses_id":"329","courses_avg":92.54},{"courses_dept":"adhe","courses_id":"329","courses_avg":93.33},{"courses_dept":"sowk","courses_id":"570","courses_avg":95},{"courses_dept":"rhsc","courses_id":"501","courses_avg":95},{"courses_dept":"psyc","courses_id":"501","courses_avg":95},{"courses_dept":"psyc","courses_id":"501","courses_avg":95},{"courses_dept":"obst","courses_id":"549","courses_avg":95},{"courses_dept":"nurs","courses_id":"424","courses_avg":95},{"courses_dept":"nurs","courses_id":"424","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"musc","courses_id":"553","courses_avg":95},{"courses_dept":"mtrl","courses_id":"599","courses_avg":95},{"courses_dept":"mtrl","courses_id":"564","courses_avg":95},{"courses_dept":"mtrl","courses_id":"564","courses_avg":95},{"courses_dept":"math","courses_id":"532","courses_avg":95},{"courses_dept":"math","courses_id":"532","courses_avg":95},{"courses_dept":"kin","courses_id":"500","courses_avg":95},{"courses_dept":"kin","courses_id":"500","courses_avg":95},{"courses_dept":"kin","courses_id":"499","courses_avg":95},{"courses_dept":"epse","courses_id":"682","courses_avg":95},{"courses_dept":"epse","courses_id":"682","courses_avg":95},{"courses_dept":"epse","courses_id":"606","courses_avg":95},{"courses_dept":"edcp","courses_id":"473","courses_avg":95},{"courses_dept":"edcp","courses_id":"473","courses_avg":95},{"courses_dept":"econ","courses_id":"516","courses_avg":95},{"courses_dept":"econ","courses_id":"516","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"crwr","courses_id":"599","courses_avg":95},{"courses_dept":"cpsc","courses_id":"589","courses_avg":95},{"courses_dept":"cpsc","courses_id":"589","courses_avg":95},{"courses_dept":"cnps","courses_id":"535","courses_avg":95},{"courses_dept":"cnps","courses_id":"535","courses_avg":95},{"courses_dept":"bmeg","courses_id":"597","courses_avg":95},{"courses_dept":"bmeg","courses_id":"597","courses_avg":95},{"courses_dept":"adhe","courses_id":"329","courses_avg":96.11}];

    queries.push({query, path, resultObject});

    return queries;
}

function getSimpleQuery(): Query {
    let query: object;

    query = {
                "WHERE":{
                   "GT":{
                      "courses_avg":97
                   }
                },
                "OPTIONS":{
                   "COLUMNS":[
                      "courses_dept",
                      "courses_avg"
                   ],
                   "ORDER":"courses_avg"
                }
            }

    return ({query, path: "courses.zip", resultObject: [{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"epse","courses_avg":97.09},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"math","courses_avg":97.25},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"epse","courses_avg":97.29},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"nurs","courses_avg":97.33},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"epse","courses_avg":97.41},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"cnps","courses_avg":97.47},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"math","courses_avg":97.48},{"courses_dept":"educ","courses_avg":97.5},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"nurs","courses_avg":97.53},{"courses_dept":"epse","courses_avg":97.67},{"courses_dept":"epse","courses_avg":97.69},{"courses_dept":"epse","courses_avg":97.78},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"crwr","courses_avg":98},{"courses_dept":"epse","courses_avg":98.08},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"nurs","courses_avg":98.21},{"courses_dept":"epse","courses_avg":98.36},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"epse","courses_avg":98.45},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.5},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"nurs","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.58},{"courses_dept":"epse","courses_avg":98.7},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"nurs","courses_avg":98.71},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"eece","courses_avg":98.75},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.76},{"courses_dept":"epse","courses_avg":98.8},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"spph","courses_avg":98.98},{"courses_dept":"cnps","courses_avg":99.19},{"courses_dept":"math","courses_avg":99.78},{"courses_dept":"math","courses_avg":99.78}]})
}

function getQueryTooLarge(): Query {
    let query: object;

    query = {
            "WHERE":{
                "GT":{
                "courses_avg":1
                 }
                },
                 "OPTIONS":{
                    "COLUMNS":[
                      "courses_dept",
                     "courses_avg"
                     ],
                     "ORDER":"courses_avg"
                }
            }

    return ({query, path: "courses.zip", resultObject: []});
}

function getInvalidQuery(): Query {
    let query: object;

    query = {
          "WHERE": {
            "GT": {
              "courses_avg": 97
            }
          },
          "OPTIONS": {
            "COLUMNS": "courses_dept",
            "ORDER": "courses_avg"
          }
    }

    return ({query, path: "courses.zip", resultObject: []});
}

function getBadPropertyQuery(): Query {
    let query: object;

    query = {
                "WHERE":{
                   "GT":{
                      "foobar":97
                   }
                },
                "OPTIONS":{
                   "COLUMNS":[
                      "courses_dept",
                      "courses_avg"
                   ],
                   "ORDER":"courses_avg"
                }
            }

    return ({query, path: "courses.zip", resultObject: []});
}

 export {getContentFromArchives, persistDir, clearDisk, getQueries, getQueryTooLarge, getInvalidQuery, getSimpleQuery, getBadPropertyQuery};
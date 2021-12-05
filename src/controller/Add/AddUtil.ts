const http = require("http");
import { count } from "console";
import {Document, parse} from "parse5";


async function processIndexTable(indexTableNode: any, contents: any) {
	indexTableNode = indexTableNode.childNodes[3];
	let builHtmlArray = [];
	let builMap = new Map();

	for (let each of indexTableNode.childNodes) {
		if (each.nodeName === "tr") {
			try {
				let strLatter = each.childNodes[3].childNodes[0].value.trim();
				let readString = "rooms/campus/discover/buildings-and-classrooms/" + strLatter;
				let builAddr = each.childNodes[7].childNodes[0].value.trim();
				let builFullName = each.childNodes[5].childNodes[1].childNodes[0].value;
                // console.log(addrArray[addrArray.length-1]);
				builHtmlArray.push(contents.files[readString].async("string"));
				builMap.set(strLatter, [builAddr, builFullName]);
			} catch (e) {
                // console.log(e);
			}
		}
	}
	return Promise.all(builHtmlArray).then((arrHtmls) => {
        // console.log(arrHtmls);
		return getCoords(builMap, arrHtmls);
	}).catch((e) => {
		throw new Error("problem");
	});
}

function httpProm(sn: any, fn: any, addr: any, tableNode: any) {
	return new Promise((resolve, reject) => {
		try {
            // https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
            let suf = addr.replace(/ /g, "%20");
			http.get("http://cs310.students.cs.ubc.ca:11316/api/v1/project_team194/" + suf, (res: any) => {
				let data = "";

                // A chunk of data has been received.
				res.on("data", (chunk: any) => {
					data += chunk;
				});

                // The whole response has been received. Print out the result.
				res.on("end", () => {
                    // console.log(data);
					resolve([sn, fn, addr, tableNode, JSON.parse(data)]);
				});
			});
		} catch (e) {
			console.log("some problem with get request");
			reject(1);
		}
	});
}

function getRoomObj(trNode: any, eachArr: any) {
    let rN = trNode.childNodes[1].childNodes[1].childNodes[0].value;
    let seats = 0;
    let rT = trNode.childNodes[7].childNodes[0].value.trim();
    let rF = trNode.childNodes[5].childNodes[0].value.trim();
    let rH = trNode.childNodes[1].childNodes[1].attrs[0].value;
    
    try {
        seats = Number(trNode.childNodes[3].childNodes[0].value.trim());
    } catch (e) {
        console.log("capacity problem");
    }
    let retObj = {
        rooms_fullname: eachArr[1],
        rooms_shortname: eachArr[0],
        rooms_number: rN,
        rooms_name: eachArr[0] + "_" + rN,
        rooms_address: eachArr[2],
        rooms_lat: eachArr[4].lat,
        rooms_lon: eachArr[4].lon,
        rooms_seats: seats,
        rooms_type: rT,
        rooms_furniture: rF,
        rooms_href: rH
    };
    return retObj;
}

function getCoords(builMap: any, arrHtmls: any) {
	let tableNode: any;
	let promArr: any = [];
	function recursiveParseTable(document: any) {
        // console.log(document.childNodes.length, document.nodeName);
		if (document.nodeName === "table") {
			tableNode = document;
		}
		if ("childNodes" in document) {
			for (let each of document.childNodes) {
				recursiveParseTable(each);
			}
		}
	}

	function builHtmlProcess(builHtml: any) {
		tableNode = undefined;
		let builParsed: any = parse(builHtml);
		recursiveParseTable(builParsed);
		if (typeof tableNode !== "undefined") {
			let sn: any = builParsed.childNodes[6].childNodes[1].childNodes[9].attrs[1].value;
			promArr.push(httpProm(sn, builMap.get(sn)[1], builMap.get(sn)[0], tableNode));
		}
        // else {
        //     let toDelete = builParsed.childNodes[6].childNodes[1].childNodes[9].attrs[1].value;
        //     builMap.delete(toDelete);
        // }
	}
	for (let each of arrHtmls) {
		builHtmlProcess(each);
	}

    // return newArr;
	return Promise.all(promArr).then((arr: any) => {
		let roomsArray: any = [];
		for (let eachArr of arr) {
			let roomsNode = eachArr[3].childNodes[3];
			for (let eachTr of roomsNode.childNodes) {
				if (eachTr.nodeName === "tr") {
					roomsArray.push(getRoomObj(eachTr, eachArr));
				}
			}
		}
		return roomsArray;
	});
}


export {processIndexTable};

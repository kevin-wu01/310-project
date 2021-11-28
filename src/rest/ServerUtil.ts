import * as fs1 from "fs-extra";
// import facade from "./data/";

const getArchivesContent = (name: string): string => {
	return fs1.readFileSync(`./data/${name}`).toString("base64");
	// .toString("base64")
};


export {getArchivesContent};

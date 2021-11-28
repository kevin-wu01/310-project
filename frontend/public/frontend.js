document.getElementById("boost-button").addEventListener("click", handleBoost);
document.getElementById("add-button").addEventListener("click", handleListDatasets);

let table = document.getElementById("data-table");
let tBody = document.createElement("tbody");
// const app = express();
console.log("opened frontend");

function handleClickMe() {
	alert("Button Clicked!");
	console.log("just clicked!");
	fetch("http://localhost:4321/echo/hello").then((response) => {
		console.log(response, "response");
	})
}

function handleBoost() {
	fetch("http://localhost:4321/query", {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			WHERE: {
				IS: {
					ubc_dept: "cpsc"
				}
			},
			OPTIONS: {
				COLUMNS: [
					"ubc_title",
					"ubc_avg",
					"ubc_instructor",
					"ubc_fail",
					"ubc_year"
				],
				ORDER: {
					dir: "DOWN",
					keys: ["ubc_avg"]
				}
			}
		})
	}).then(response => response.json())
		.then((data) => {
			try {
				generateTable(data.result);
			} catch (e) {
				alert("Oops! Something went wrong.");
			}
		});
}

function handleListDatasets() {
	fetch("http://localhost:4321/datasets", {
		method: 'get'
	}).then(response => response.json())
		.then((data) => {
			let filteredData = [];
			data = data.result;
			data.forEach((d) => {
				let val = d.id;
				if (d.kind === "courses") {
					filteredData.push({id: val});
				}
			});

			try {
				generateTable(filteredData);
			} catch (e) {
				alert("No datasets available");
			}
	});
}

function handleAdd() {
	fetch("http://localhost:4321/datasets", {
		method: 'post',
		body: JSON.stringify({a: 7, b: "three"})
	}).then((res) => {
		console.log("posted!");
		console.log(res);
	})
}

function generateTable(data) {
	document.querySelector("#data-table").innerHTML = "";
	tBody.innerHTML = "";

	if (data.length !== 0) {
		let labelRow = document.createElement("tr");
		Object.keys(data[0]).forEach((key) => {
			let cell = document.createElement("td");
			let cellText = document.createTextNode(key);
			cell.appendChild(cellText);
			labelRow.appendChild(cell);
		})

		tBody.appendChild(labelRow);

		for (let idx = 0; idx < data.length; idx++) {
			let row = document.createElement("tr");
			let rowVal = data[idx];

			for (let i = 0; i < Object.keys(data[0]).length; i++) {
				let cell = document.createElement("td");
				let val = rowVal[Object.keys(rowVal)[i]];
				if (typeof val !== "string") {
					val = val.toString();
				}
				let cellText = document.createTextNode(val);
				cell.appendChild(cellText);
				row.appendChild(cell);
			}

			tBody.appendChild(row);
		}

		table.appendChild(tBody);
		table.setAttribute("border", "1");
	} else {
		throw new Error("no data found");
	}
}

function handleDelete() {
	fetch("http://localhost:4321/datasets/1231", {
		method: 'delete'
	}).then((res) => {
		console.log(res);
	});
}

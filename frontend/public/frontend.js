document.getElementById("click-me-button").addEventListener("click", handleClickMe);
document.getElementById("add-button").addEventListener("click", handleAdd);
// const app = express();
console.log("opened frontend");

function handleClickMe() {
	alert("Button Clicked!");
	console.log("just clicked!");
	fetch("http://localhost:4321/echo/hello").then((response) => {
		console.log(response, "response");
	})
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

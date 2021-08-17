const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const generateMarkdown = require("./utils/generateMarkdown.js");

// Location of the output README.md file
const outputFile = "./output/README.md";
// Default headers used for Github license API
const githubLicenseApiHeaders = {
	Accept: "application/vnd.github.v3+json",
	"User-Agent": "MichaelHermes",
};

let availableLicenses = [];

// This needs to be 'let' instead of 'const' to allow the licenses to be dynamically inserted into the array.
let questions = [
	{
		message: "What is your project title?",
		name: "title",
	},
	{
		message: "Please enter a brief description for your project:",
		name: "description",
	},
	{
		message: "What are the installation instructions for your project, if any?",
		name: "installation",
	},
	{
		message: "How is this project used?",
		name: "usage",
	},
	// License information will be dynamically inserted into this position in the array via the 'insertLicensesIntoQuestions' function.
	{
		message: "How would someone contribute to your project?",
		name: "contribute",
	},
	{
		message: "Please enter any test instructions for your project...",
		name: "tests",
	},
	{
		message: "What is your Github username?",
		name: "github",
	},
	{
		message: "What is your email address?",
		name: "email",
	},
];

// Credit: https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
// This is a helper function that issues an http or https GET request using the appropriate node module based on protocol. It returns a Promise that resolves with a JSON object representing the response body and rejects on a non-200 status code or request error.
const getContent = (url, headers) => {
	const contentUrl = new URL(url);
	const options = {
		hostname: contentUrl.hostname,
		path: `${contentUrl.pathname}${contentUrl.search}`,
		headers: headers,
	};

	// Return a new pending promise
	return new Promise((resolve, reject) => {
		// Select http or https module, depending on reqested url
		const lib =
			contentUrl.protocol == "https:" ? require("https") : require("http");
		const request = lib.get(options, response => {
			// Handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(
					new Error("Failed to load page, status code: " + response.statusCode)
				);
			}
			// Temporary data holder
			let body = "";
			// On every content chunk, append to the body
			response.on("data", chunk => (body += chunk));
			// When we are done, resolve promise with an 'availableLicense' object
			response.on("end", () => resolve(JSON.parse(body)));
		});
		// Handle connection errors of the request
		request.on("error", err => reject(err));
	});
};

// Retrieves detailed information about a specific Github license, located at the target 'url' (Github API). This function returns a Promise which resolves with an object containing the desired details about the license and rejects on error.
function getLicenseContent(url) {
	// Return a new pending promise
	return new Promise((resolve, reject) => {
		getContent(url, githubLicenseApiHeaders)
			.then(licenseObj => {
				// Resolve with an object of desired license properties.
				resolve({
					displayName: licenseObj.name,
					badgeDisplayName: licenseObj.spdx_id,
					link: licenseObj.html_url,
				});
			})
			.catch(err => reject(err));
	});
}

// Uses the Github License API (https://docs.github.com/en/rest/reference/licenses) to obtain the first 5 featured licenses from Github. These licenses are then added as choices to the questions supplied to the user. In this way, the user is always being presented with up-to-date license options.
async function getCommonlyUsedLicenses() {
	await getContent(
		"https://api.github.com/licenses?featured=true&per_page=5&page=1",
		githubLicenseApiHeaders
	)
		.then(async featuredLicenses => {
			let licenses = featuredLicenses.map(license =>
				getLicenseContent(license.url)
			);
			await Promise.all(licenses)
				.then(licenseDetails => {
					availableLicenses = licenseDetails; // Persist a global copy of the license information for use outside this callback.
					insertLicensesIntoQuestions();
				})
				.catch(err => console.error(err));
		})
		.catch(err => console.error(err));
}

// Constructs the license question and splices it into the questions array.
function insertLicensesIntoQuestions() {
	let licenseChoices = ["None"];
	for (const license of availableLicenses) {
		licenseChoices.push(license.displayName);
	}

	questions.splice(3, 0, {
		type: "list",
		message: "Would you like to license your project?",
		name: "license",
		choices: licenseChoices,
	});
}

// A helper function to write data to a file. This will ultimately write the README markdown content to the output file.
function writeToFile(fileName, data) {
	fs.writeFile(fileName, data, err => {
		if (err) throw err;
		console.log("File written successfully!");
	});
}

// Initializes the application by readying the output directory, obtaining license information from the Github License API, and gathering user input.
async function init() {
	// Check to make sure our output directory exists and create it if necessary.
	const outputDir = path.parse(outputFile).dir;
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Generate the license question information.
	await getCommonlyUsedLicenses();

	// Gather user details, generate the markdown, and write to a file.
	inquirer.prompt(questions).then(answers => {
		// Add the license information to the answers that get passed to 'generateMarkdown' so that the appropriate license badge and link can be generated.
		for (const license of availableLicenses) {
			answers[license.displayName] = license;
		}
		writeToFile(outputFile, generateMarkdown(answers));
	});
}

// Function call to initialize app
init();

// TODO: Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const generateMarkdown = require("./utils/generateMarkdown.js");
const outputFile = "./output/README.md";

// TODO: Create an array of questions for user input
const questions = [
	{
		message: "What is your project title?",
		name: "title",
	},
	{
		message: "Please enter the description for your project...",
		name: "description",
	},
	{
		message: "What are the installation instructions for your project?",
		name: "installation",
	},
	{
		message: "What is the usage information for your project?",
		name: "usage",
	},
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

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
	fs.writeFile(fileName, data, err => {
		if (err) throw err;
		console.log("File written successfully!");
	});
}

// TODO: Create a function to initialize app
function init() {
	// Check to make sure our output directory exists and create it if necessary.
	const outputDir = path.parse(outputFile).dir;
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// Gather user details, generate the markdown, and write to a file.
	inquirer.prompt(questions).then(answers => {
		writeToFile(outputFile, generateMarkdown(answers));
	});
}

// Function call to initialize app
init();

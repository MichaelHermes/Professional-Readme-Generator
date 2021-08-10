// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license) {
	// https://img.shields.io/badge/<LABEL>-<MESSAGE>-<COLOR>

	switch (license) {
		case "Apache 2.0 License":
			return "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
		case "GNU General Public License v3.0":
			return "[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-green.svg)](http://www.gnu.org/licenses/gpl-3.0)";
		case "The MIT License":
			return "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
		case "None":
		default:
			return "";
	}
}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(license) {
	switch (license) {
		case "Apache 2.0 License":
			return "https://opensource.org/licenses/Apache-2.0";
		case "GNU General Public License v3.0":
			return "http://www.gnu.org/licenses/gpl-3.0";
		case "The MIT License":
			return "https://opensource.org/licenses/MIT";
		case "None":
		default:
			return "";
	}
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license) {
	if (license && license != "None") {
		return `${renderLicenseBadge(license)}\n
Information about this license can be found [here](${renderLicenseLink(
			license
		)}).`;
	} else {
		return "This project is not currently licensed.";
	}
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data) {
	return `# ${data.title}
${renderLicenseBadge(data.license)}
## Description
${data.description}
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [Questions](#questions)
## Installation
${data.installation}
## Usage
${data.usage}
## License
${renderLicenseSection(data.license)}
## How to Contribute
${data.contribute}
## Tests
${data.tests}
## Questions?
Find me on [Github](https://github.com/${data.github}) or email me at [${
		data.email
	}](mailto:${data.email}).`;
}

module.exports = generateMarkdown;

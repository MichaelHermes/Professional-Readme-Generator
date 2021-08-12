// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(answers) {
	return answers.license == "None"
		? ""
		: `[![License](https://img.shields.io/badge/License-${answers[
				answers.license
		  ].badgeDisplayName.replace("-", "%20")}-blue.svg)](${
				answers[answers.license].link
		  })`;
}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(answers) {
	return answers.license == "None" ? "" : answers[answers.license].link;
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(answers) {
	if (answers && answers.license != "None") {
		return `${renderLicenseBadge(answers)}\n
This application is covered under the ${
			answers[answers.license].badgeDisplayName
		} license. Information about this license can be found [here](${renderLicenseLink(
			answers
		)}).`;
	} else {
		return "This project is not currently licensed.";
	}
}

// TODO: Create a function to generate markdown for README
function generateMarkdown(answers) {
	return `# ${answers.title}
${renderLicenseBadge(answers)}
## Description
${answers.description}
## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [Questions](#questions)
## Installation
${answers.installation}
## Usage
${answers.usage}
## License
${renderLicenseSection(answers)}
## How to Contribute
${answers.contribute}
## Tests
${answers.tests}
## Questions?
Find me on [Github](https://github.com/${answers.github}) or email me at [${
		answers.email
	}](mailto:${answers.email}).`;
}

module.exports = generateMarkdown;

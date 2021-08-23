// Returns the markdown to render a license badge if a license was selected by the user. Returns and empty string if the user chose not to license the application.
function renderLicenseBadge(answers) {
	return answers.license == "None"
		? ""
		: `[![License](https://img.shields.io/badge/License-${answers[
				answers.license
		  ].badgeDisplayName.replace("-", "%20")}-blue.svg)](${
				answers[answers.license].link
		  })`;
}

// Returns a link to access details about the chosen license. Returns an empty string if the user chose not to license the application.
function renderLicenseLink(answers) {
	return answers.license == "None" ? "" : answers[answers.license].link;
}

// Returns the markdown necessary to render the 'License' section in the README file. Returns a default string if no license was selected.
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

// Returns the markdown content to be written into the README file.
function generateMarkdown(answers) {
	return `<h1 align="center">${answers.title}</h1>

## Description
${renderLicenseBadge(answers)}

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

# Unit Test Generator Extension for Visual Studio Code

## Overview
This extension for Visual Studio Code leverages the OpenAI GPT API to automate the generation of unit tests, aiming to enhance developer efficiency by reducing the time spent on manual test creation. It supports multiple programming languages and ensures high coverage for unit tests.

## Experiment Data
The extension has been evaluated with .NET, JavaScript, and Java, showing promising results:

- **.NET**: 10 tests were done with mean compile success of 95.33%, with a median of 100%. Line coverage mean at 83.33%, and a median of 100%.
- **JavaScript**: 10 tests were done with 100% success rate in test compilation and line coverage across 10 different functions.


## Installation

1. Clone the repository from the provided GitHub link.
2. Navigate to the cloned directory.

## Configuration

Before using the extension, you need to set up an environment variable for the OpenAI API key:

1. Create a `.env` file in the root of the project.
2. Add the following line to the `.env` file:
OPENAI_KEY=your_openai_api_key_here

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Usage

To use the extension within Visual Studio Code:

1. Open the command palette (Ctrl+Shift+P or Cmd+Shift+P on Mac).
2. Run the command `extension.generateUnitTest`.
3. A webview panel will open where you can input the class constructor, function, and any additional information.
4. Click the `Generate Tests` button to receive generated unit tests.

## Running Experiments

To reproduce the experiment results:

1. Provide the necessary constructor, function, and additional information (like and user defined classes' constructors) in the webview panel inputs.
2. Use the `Generate Tests` function to create unit tests.
3. Compare the generated tests with the experiment data provided.



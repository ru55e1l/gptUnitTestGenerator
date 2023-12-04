/* eslint-disable no-undef */
const vscode = acquireVsCodeApi();

document.getElementById('testForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const constructorInput = document.getElementById('constructorInput').value;
    const functionInput = document.getElementById('functionInput').value;
    const additionalInput = document.getElementById('additionalInput').value;

    vscode.setState({ constructorInput, functionInput, additionalInput });
    vscode.postMessage({
        command: 'generateTests',
        constructorInput,
        functionInput,
        additionalInput
    });
    document.getElementById('generateTestsButton').disabled = true;
    console.log(document.getElementById('generateTestsButton'));
});

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'updateResponseOutput':
            updateResponseOutput(message.content);
            document.getElementById('generateTestsButton').disabled = false;
            break;
    }
});

function updateResponseOutput(response) {
    const responseOutput = document.getElementById('responseOutput');
    if (responseOutput) {
        console.log(response);
        responseOutput.value = response.replace(/\\n/g, '\n'); // Ensure newlines are rendered correctly
    }
}

// Restore the state
const initialState = vscode.getState();
if (initialState) {
    document.getElementById('constructorInput').value = initialState.constructorInput;
    document.getElementById('functionInput').value = initialState.functionInput;
    document.getElementById('additionalInput').value = initialState.additionalInput;
}

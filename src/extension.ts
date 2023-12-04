/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { OpenAI } from 'openai';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.generateUnitTest', () => {
        const panel = vscode.window.createWebviewPanel(
            'unitTestGenerator',
            'Unit Test Generator',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))],
                retainContextWhenHidden: true // This will retain the state
            }
        );

        const htmlPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webviewContent.html'));
        //@ts-ignore
        const previousState = panel.webview['state']; 
        const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');
        panel.webview.html = getWebviewContent(htmlContent, previousState);

        // Set up a message listener
        panel.webview.onDidReceiveMessage(
            async message => {
                if (message.command === 'generateTests') {
                    const tests = await generateTests(message.constructorInput, message.functionInput, message.additionalInput);
                    panel.webview.postMessage({ command: 'updateResponseOutput', content: tests });
                }
            },
            undefined,
            context.subscriptions
        );

        function getWebviewContent(htmlContent: string, previousState: any) { // Use 'any' type for previousState
            return htmlContent.replace(/{{constructorInput}}/g, previousState?.constructorInput || '')
                              .replace(/{{functionInput}}/g, previousState?.functionInput || '')
                              .replace(/{{additionalInput}}/g, previousState?.additionalInput || '')
                              .replace(/{{basePath}}/g, panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src'))).toString());
        }
    });

    if (context.subscriptions) { // Check if subscriptions is not undefined
        context.subscriptions.push(disposable);
    }
}

async function generateTests(constructorInput: any, functionInput: any, additionalInput: any) {
    try {

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const prompt = `Generate unit tests for the following code. If there are any errors, or bad practices generate tests that fail to find that error (and include comments to indicate what this error is). Do not assume anything, if there needs to be more context, just say what more you need:\nConstructor: ${constructorInput}\nFunction: ${functionInput}\nAdditional Info: ${additionalInput}`;
        const assistant = await openai.beta.assistants.retrieve("asst_pfesAkzICkTWsugUgE4fhF2D");
        const thread = await openai.beta.threads.create();

        const myThreadMessage = await openai.beta.threads.messages.create(
            thread.id,
            {
            role: "user",
            content: prompt,
            }
        );

        const myRun = await openai.beta.threads.runs.create(
            thread.id, 
            {
                assistant_id: assistant.id,
                instructions: "You are a Unit Test generator for every coding language you know. You are to take a constructor for a class, and a function for that class and generator unit tests for 100% line coverage for that function."
            }
        );
        let keepRetrievingRun;

        while (myRun.status !== "completed") {
            keepRetrievingRun = await openai.beta.threads.runs.retrieve(
            thread.id,
            myRun.id
            );

            console.log(`Run status: ${keepRetrievingRun.status}`);

            if (keepRetrievingRun.status === "completed") {
            break;
            }
        }
        

        const allMessages = await openai.beta.threads.messages.list(
            thread.id
        );
        
        //@ts-ignore
        return allMessages.data[0].content[0].text.value;
    } catch (error){
        return "Error";
    }

}


export function deactivate() {}

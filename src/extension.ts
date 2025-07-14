import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const formatDocument = vscode.commands.registerCommand('anyjson.formatDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const fullText = document.getText();
        
        try {
            const formattedText = formatMultiLineJson(fullText);
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(fullText.length)
            );
            edit.replace(document.uri, fullRange, formattedText);
            vscode.workspace.applyEdit(edit);
        } catch (error) {
            vscode.window.showErrorMessage(`Error formatting JSON: ${error}`);
        }
    });

    const formatSelection = vscode.commands.registerCommand('anyjson.formatSelection', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        
        try {
            const formattedText = formatMultiLineJson(selectedText);
            const edit = new vscode.WorkspaceEdit();
            edit.replace(editor.document.uri, selection, formattedText);
            vscode.workspace.applyEdit(edit);
        } catch (error) {
            vscode.window.showErrorMessage(`Error formatting JSON: ${error}`);
        }
    });

    context.subscriptions.push(formatDocument);
    context.subscriptions.push(formatSelection);
}

function formatMultiLineJson(text: string): string {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '') {
            formattedLines.push('');
            continue;
        }
        
        try {
            const jsonObject = JSON.parse(line);
            const formatted = JSON.stringify(jsonObject, null, 2);
            formattedLines.push(formatted);
        } catch (error) {
            if (isPartialJson(line)) {
                const completeJson = findCompleteJson(lines, i);
                if (completeJson.success) {
                    try {
                        const jsonObject = JSON.parse(completeJson.json);
                        const formatted = JSON.stringify(jsonObject, null, 2);
                        formattedLines.push(formatted);
                        i = completeJson.endIndex;
                        continue;
                    } catch (parseError) {
                        formattedLines.push(line);
                    }
                } else {
                    formattedLines.push(line);
                }
            } else {
                formattedLines.push(line);
            }
        }
    }
    
    return formattedLines.join('\n');
}

function isPartialJson(line: string): boolean {
    const trimmed = line.trim();
    return (trimmed.startsWith('{') && !trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && !trimmed.endsWith(']')) ||
           (trimmed.includes(':{') || trimmed.includes(':[')) ||
           (trimmed.endsWith(',') || trimmed.endsWith(':'));
}

function findCompleteJson(lines: string[], startIndex: number): { success: boolean; json: string; endIndex: number } {
    let jsonString = '';
    let braceCount = 0;
    let bracketCount = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        jsonString += (i > startIndex ? '\n' : '') + line;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (inString) {
                continue;
            }
            
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
            } else if (char === '[') {
                bracketCount++;
            } else if (char === ']') {
                bracketCount--;
            }
            
            if (braceCount === 0 && bracketCount === 0 && (char === '}' || char === ']')) {
                try {
                    JSON.parse(jsonString);
                    return { success: true, json: jsonString, endIndex: i };
                } catch (error) {
                    continue;
                }
            }
        }
    }
    
    return { success: false, json: '', endIndex: startIndex };
}

export function deactivate() {}
/**
 * @file extension.ts
 * @description Main extension file for VS Code Elastic Query Studio
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2025-04-15
 * 
 * This file provides:
 * - Extension activation and deactivation handlers
 * - Core functionality for Elasticsearch query execution
 * - Integration with VS Code's extension APIs
 * - Configuration and host management
 * 
 * @history
 * - 2024-03-14 Bug fixes and improvements
 *   - Fixed host connection initialization issue
 *   - Added proper error handling for undefined editor states
 *   - Improved component initialization logic
 *   - Added proper command registration for 'extension.execute'
 *   - Enhanced event handler management
 * - 2024-03-01 Initial documented version
 *   - Added proper file documentation
 *   - Implemented core extension functionality
 *   - Added query execution and result display
 * - 2025-04-15 Code cleanup
 *   - Removed unused variables and parameters
 *   - Enhanced type checking compliance
 *   - Removed unused imports
 */

import * as vscode from 'vscode';
import path = require('path');
import * as fs from 'fs';
import * as os from 'os';
import { ElasticCompletionItemProvider } from './ElasticCompletionItemProvider';
import { ElasticCodeLensProvider } from './ElasticCodeLensProvider';
import { ElasticContentProvider } from './ElasticContentProvider';
import { ElasticDecoration } from './ElasticDecoration';
import { ElasticMatch } from './ElasticMatch';
import { ElasticMatches } from './ElasticMatches';
import { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';

export async function activate(context: vscode.ExtensionContext) {
    // Initialize host configuration
    getHost(context);
    
    // Define supported languages
    const languages = ['esql', 'elasticsearch'];
    
    // Initialize providers
    let resultsProvider = new ElasticContentProvider();
    let esMatches: ElasticMatches | undefined;
    let decoration: ElasticDecoration | undefined;
    
    // Register content provider
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider('elasticsearch', resultsProvider)
    );

    // Register CodeLens provider
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(languages, new ElasticCodeLensProvider(context))
    );

    function initializeEditorComponents(editor: vscode.TextEditor | undefined) {
        if (!editor || editor.document.languageId !== 'esql') {
            return false;
        }
        
        try {
            esMatches = new ElasticMatches(editor);
            decoration = new ElasticDecoration(context);
            decoration.UpdateDecoration(esMatches);
            return true;
        } catch (error) {
            console.error('Failed to initialize editor components:', error);
            return false;
        }
    }

    // Initialize if active editor exists
    if (vscode.window.activeTextEditor) {
        initializeEditorComponents(vscode.window.activeTextEditor);
    }

    // Register event handlers
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                initializeEditorComponents(editor);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => {
            const editor = vscode.window.activeTextEditor;
            if (editor && e.document === editor.document && e.document.languageId === 'esql') {
                initializeEditorComponents(editor);
            }
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(e => {
            if (e.textEditor.document.languageId === 'esql' && esMatches && decoration) {
                esMatches.UpdateSelection(e.textEditor);
                decoration.UpdateDecoration(esMatches);
            }
        })
    );

    // Register completion and hover provider
    let esCompletionHover = new ElasticCompletionItemProvider(context);
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(languages, esCompletionHover, '/', '?', '&', '"'),
        vscode.languages.registerHoverProvider(languages, esCompletionHover)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('elastic-query-studio.execute', (em?: ElasticMatch) => {
            if (!esMatches) {
                vscode.window.showErrorMessage('No active Elasticsearch query editor');
                return;
            }
            executeQuery(context, resultsProvider, em || esMatches.Selection);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('elastic-query-studio.setHost', () => {
            setHost(context);
        })
    );

    vscode.commands.registerCommand('elastic-query-studio.setClip', (_uri: vscode.Uri, _query: string) => {
        // Commented out functionality
        // var ncp = require('copy-paste');
        // ncp.copy(query, function () {
        // vscode.window.showInformationMessage('Copied to clipboard');
        // });
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('elastic-query-studio.open', (em: ElasticMatch) => {
            var column = 0;
            let uri = vscode.Uri.file(em.File.Text);
            return vscode.workspace
                .openTextDocument(uri)
                .then(textDocument =>
                    vscode.window.showTextDocument(
                        textDocument,
                        column ? (column > vscode.ViewColumn.Three ? vscode.ViewColumn.One : column) : undefined,
                        true,
                    ),
                );
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('elastic-query-studio.lint', (em: ElasticMatch) => {
            try {
                const editor = vscode.window.activeTextEditor;
                const config = vscode.workspace.getConfiguration('editor');
                const tabSize = +(config.get('tabSize') as number);

                editor!.edit(editBuilder => {
                    if (em.HasBody) {
                        editBuilder.replace(em.Body.Range, JSON.stringify(JSON.parse(em.Body.Text), null, tabSize));
                    }
                });
            } catch (error: any) {
                console.log(error.message);
            }
        }),
    );
}

async function setHost(context: vscode.ExtensionContext): Promise<string> {
    const host = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
        prompt: 'Please enter the elastic host',
        ignoreFocusOut: true,
        value: getHost(context),
    });

    context.workspaceState.update('elasticsearch.host', host);
    vscode.workspace.getConfiguration().update('elasticsearch.host', host);
    return host || 'localhost:9200';
}

export function getHost(context: vscode.ExtensionContext): string {
//    return context.workspaceState.get('elasticsearch.host') || vscode.workspace.getConfiguration().get('elasticsearch.host', 'localhost:9200');
    // Debug JDY
    const host = context.workspaceState.get('elasticsearch.host') || vscode.workspace.getConfiguration().get('elasticsearch.host', 'localhost:9200');
    console.log('Current Elasticsearch host:', host);  // 디버그 로그
    return host as string;
}

export async function executeQuery(context: vscode.ExtensionContext, _resultsProvider: ElasticContentProvider, em: ElasticMatch) {
    if (!em) {
        return;
    }

    const host = getHost(context);
    const url = `${host}${em.Path.Text}`;
    
    try {
        const response = await axiosInstance.request({
            method: em.Method.Text.toLowerCase() as 'get' | 'post' | 'put' | 'delete',
            url: url,
            data: em.HasBody ? JSON.parse(em.Body.Text) : undefined,
        });

        showResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError;
            showResult(JSON.stringify(axiosError.response?.data || axiosError.message, null, 2));
        } else {
            showResult(JSON.stringify(error, null, 2));
        }
    }
}

function showResult(result: string, column?: vscode.ViewColumn): Thenable<void> {
    const tempResultFilePath = path.join(os.homedir(), '.elastic-query-studio');
    const resultFilePath = vscode.workspace.rootPath || tempResultFilePath;

    let uri = vscode.Uri.file(path.join(resultFilePath, 'result.json'));
    if (!fs.existsSync(uri.fsPath)) {
        uri = uri.with({ scheme: 'untitled' });
    }
    return vscode.workspace
        .openTextDocument(uri)
        .then(textDocument =>
            vscode.window.showTextDocument(textDocument, column ? (column > vscode.ViewColumn.Three ? vscode.ViewColumn.One : column) : undefined, true),
        )
        .then(editor => {
            editor.edit(editorBuilder => {
                if (editor.document.lineCount > 0) {
                    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                    editorBuilder.delete(
                        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLine.range.start.line, lastLine.range.end.character)),
                    );
                }
                editorBuilder.insert(new vscode.Position(0, 0), result);
            });
        });
}

// this method is called when your extension is deactivated
export function deactivate() {}

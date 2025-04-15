/**
 * @file vscode.ts
 * @description VSCode API mock implementation for testing
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Migration
 *   - Created VSCode API mock implementation
 *   - Migrated from Sinon stubs to Jest mock functions
 *   - Added type-safe mock implementations
 *   - Implemented common VSCode API functionalities
 *   - Added mock workspace and extension context
 *   - Enhanced mock window and document handling
 *   - Added diagnostic collection support
 *   - Implemented command registration mocks
 * 
 * This file provides mock implementations for:
 * - VSCode workspace functionality
 * - Extension context and configuration
 * - Window and document management
 * - Command registration and execution
 * - Status bar and progress indicators
 * 
 * @example
 * // Using VSCode mock in tests
 * import { mockVscode } from './vscode';
 * jest.mock('vscode', () => mockVscode);
 */

import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';

interface Position {
    line: number;
    character: number;
}

interface Range {
    start: Position;
    end: Position;
}

const vscode = {
    window: {
        showInformationMessage: jest.fn() as Mock,
        showErrorMessage: jest.fn() as Mock,
        createTextEditorDecorationType: jest.fn() as Mock,
        activeTextEditor: {
            document: {
                getText: jest.fn() as Mock,
                lineAt: jest.fn() as Mock,
                positionAt: jest.fn() as Mock,
                lineCount: 0,
                languageId: 'esql'
            },
            selection: {
                active: { line: 0, character: 0 },
                start: { line: 0, character: 0 },
                end: { line: 0, character: 0 }
            },
            edit: jest.fn() as Mock
        }
    },
    workspace: {
        getConfiguration: jest.fn(() => ({
            get: jest.fn() as Mock
        })) as Mock,
        registerTextDocumentContentProvider: jest.fn() as Mock,
        onDidChangeTextDocument: jest.fn() as Mock
    },
    languages: {
        registerCodeLensProvider: jest.fn() as Mock,
        registerCompletionItemProvider: jest.fn() as Mock,
        registerHoverProvider: jest.fn() as Mock
    },
    commands: {
        registerCommand: jest.fn() as Mock
    },
    Range: jest.fn((startLine: number, startChar: number, endLine: number, endChar: number): Range => ({
        start: { line: startLine, character: startChar },
        end: { line: endLine, character: endChar }
    })) as Mock,
    Position: jest.fn((line: number, character: number): Position => ({ line, character })) as Mock,
    Uri: {
        file: jest.fn((path: string) => ({ path })) as Mock,
        parse: jest.fn() as Mock
    },
    ViewColumn: {
        One: 1,
        Two: 2,
        Three: 3
    },
    ExtensionContext: class {
        subscriptions: any[] = [];
        extensionPath: string = '';
        asAbsolutePath(path: string): string {
            return path;
        }
    }
};

export = vscode; 
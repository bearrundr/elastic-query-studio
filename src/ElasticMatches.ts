/**
 * @file ElasticMatches.ts
 * @description Collection manager for Elasticsearch query matches
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-01
 * 
 * This file provides:
 * - Management of multiple Elasticsearch query matches
 * - Editor selection tracking and updates
 * - Query match collection initialization
 * - Active selection management
 * 
 * @history
 * - 2024-03-01 Initial documented version
 *   - Implemented matches collection management
 *   - Added selection tracking
 *   - Added editor integration
 */

import * as vscode from 'vscode';
import { ElasticMatch } from './ElasticMatch';

export class ElasticMatches {
    Editor!: vscode.TextEditor;
    Matches: ElasticMatch[];
    Selection!: ElasticMatch;

    public constructor(editor: vscode.TextEditor) {
        if (!editor) {
            console.error('updateDecorations(): no active text editor.');
            this.Matches = [];
            return;
        }
        this.Editor = editor;
        this.Matches = [];

        var matched = false;

        for (var i = 0; i < editor.document.lineCount; i++) {
            var line = editor.document.lineAt(i);
            var trimedLine = line.text.trim();
            if (trimedLine.length == 0) continue;

            if (matched && trimedLine.startsWith('{')) this.Matches[this.Matches.length - 1].HasBody = true;

            matched = false;
            var match = ElasticMatch.RegexMatch.exec(line.text);

            if (match != null) {
                matched = true;
                let em = new ElasticMatch(line, match);
                this.Matches.push(em);
            }
        }

        this.UpdateSelection(editor);
    }

    public UpdateSelection(editor: vscode.TextEditor) {
        this.Editor = editor;
        this.Matches.forEach(element => {
            element.Selected = element.Range.contains(editor.selection);
            if (element.Selected) this.Selection = element;
        });
    }
}

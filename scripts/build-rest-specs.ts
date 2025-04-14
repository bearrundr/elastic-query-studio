/**
 * @file scripts/build-rest-specs.ts
 * @description Elasticsearch REST API Specification Builder
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-27
 * 
 * This script provides:
 * - Automated generation of TypeScript index files from REST API specs
 * - Support for multiple Elasticsearch versions
 * - Processing of common definitions (_common.json)
 * - Type-safe API specification generation
 * - Progress logging and error handling
 * 
 * @history
 * - 2024-03-27 Initial documented version
 *   - Added support for versions 6.8.0, 7.17.0, 8.18.0, and 9.0.0
 *   - Implemented automated index.ts generation
 *   - Added progress logging and error handling
 */

import * as fs from 'fs';
import * as path from 'path';

const SPEC_VERSIONS = [
    'v6_8_0',
    'v7_17_0',
    'v8_18_0',
    'v9_0_0'
]; // 필요한 버전들 추가
const SPEC_BASE_DIR = path.join(__dirname, '..', 'src', 'rest-spec');

function buildSpecIndex(version: string) {
    const specDir = path.join(SPEC_BASE_DIR, version);
    console.log(`\n=== Processing version: ${version} ===`);
    console.log(`Directory: ${specDir}`);
    
    if (!fs.existsSync(specDir)) {
        console.error(`Directory does not exist: ${specDir}`);
        return;
    }
    
    let output = '';
    output += '// This file is auto-generated. DO NOT EDIT.\n\n';

    // _common.json 처리
    const commonPath = path.join(specDir, '_common.json');
    try {
        const commonContent = fs.readFileSync(commonPath, 'utf8');
        const parsedCommon = JSON.parse(commonContent);
        output += `const def__common = JSON.parse('${JSON.stringify(parsedCommon)}');\n\n`;
        console.log('✓ Processed _common.json');
    } catch (error) {
        console.error(`Error processing _common.json:`, error);
        throw error;
    }

    // API 스펙 파일 처리
    const files = fs.readdirSync(specDir)
        .filter(file => file.endsWith('.json') && file !== '_common.json')
        .sort();
    console.log(`Found ${files.length} API spec files`);

    files.forEach((file, index) => {
        try {
            const content = fs.readFileSync(path.join(specDir, file), 'utf8');
            const parsedContent = JSON.parse(content);
            const name = path.basename(file, '.json');
            const varName = name.replace(/\./g, '_');
            const jsonString = JSON.stringify(parsedContent)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/`/g, '\\`');
            output += `const def_${varName} = JSON.parse('${jsonString}');\n\n`;
            console.log(`✓ [${index + 1}/${files.length}] ${file}`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
            throw error;
        }
    });

    // Export 생성
    output += 'export const definitions = {\n';
    output += '    _common: def__common,\n';
    files.forEach(file => {
        const name = path.basename(file, '.json');
        const varName = name.replace(/\./g, '_');
        output += `    '${name}': def_${varName},\n`;
    });
    output += '};\n';

    // index.ts 파일 생성
    const outputPath = path.join(specDir, 'index.ts');
    fs.writeFileSync(outputPath, output);
    console.log(`\n✓ Generated ${outputPath}`);
    console.log(`  Size: ${(output.length / 1024).toFixed(2)} KB`);
}

console.log('=== Elasticsearch REST API Spec Builder ===');
SPEC_VERSIONS.forEach(version => {
    buildSpecIndex(version);
});
console.log('\n=== Build completed ==='); 
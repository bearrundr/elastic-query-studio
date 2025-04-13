/**
 * @file rest-spec/index.ts
 * @description REST API specification version management
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-01
 * 
 * This file provides:
 * - Central management of Elasticsearch REST API specifications
 * - Version-specific API definitions
 * - API version mapping and exports
 * - Support for multiple Elasticsearch versions
 * 
 * @history
 * - 2024-03-01 Initial documented version
 *   - Added version mapping for 2.4.6, 5.6.4, and 6.0.0
 *   - Implemented central export management
 *   - Added version-specific imports
 */

import * as v2_4_6 from './v2_4_6';
import * as v5_6_4 from './v5_6_4';
import * as v6_0_0 from './v6_0_0';

export default {
    '2.4.6': v2_4_6,
    '5.6.4': v5_6_4,
    '6.0.0': v6_0_0,
};

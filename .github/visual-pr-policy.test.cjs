const assert = require('node:assert/strict');
const test = require('node:test');
const isExemptVisualPr = require('./visual-pr-policy.cjs');

test('only approved bots with a nonempty dependency-only PR are exempt', () => {
    const dependencies = [{ filename: 'package.json' }, { filename: 'yarn.lock' }];
    for (const author of ['dependabot[bot]', 'github-actions[bot]']) {
        assert.equal(isExemptVisualPr(author, dependencies), true);
        assert.equal(isExemptVisualPr(author, [{ filename: 'yarn.lock' }]), true);
        assert.equal(isExemptVisualPr(author, []), false);
        assert.equal(isExemptVisualPr(author, [...dependencies, { filename: 'app.vue' }]), false);
        assert.equal(isExemptVisualPr(author, [{ filename: 'apps/site/package.json' }]), false);
        assert.equal(isExemptVisualPr(author, [{
            filename: 'package.json', previous_filename: 'app.vue',
        }]), false);
    }
    assert.equal(isExemptVisualPr('developer', dependencies), false);
    assert.equal(isExemptVisualPr('another[bot]', dependencies), false);
});

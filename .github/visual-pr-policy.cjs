const automatedAuthors = new Set(['dependabot[bot]', 'github-actions[bot]']);
const dependencyFiles = new Set(['package.json', 'yarn.lock']);

module.exports = function isExemptVisualPr(author, files) {
    return automatedAuthors.has(author)
        && files.length > 0
        && files.every((file) => dependencyFiles.has(file.filename)
            && (!file.previous_filename || dependencyFiles.has(file.previous_filename)));
};

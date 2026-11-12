import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const problems = [];

function read(relative) {
	return readFileSync(join(root, relative), 'utf8');
}

function readJson(relative) {
	return JSON.parse(read(relative));
}

const claims = readJson('public/claims.json');
const project = readJson('public/project.json');
const collected = claims.tests?.collected;
const runnable = claims.tests?.runnable;
const commits = claims.repo?.commits;

if (project.project?.tests?.collected !== collected) {
	problems.push(`project.json: tests.collected ${project.project?.tests?.collected} != claims ${collected}`);
}
if ((project.project?.tests?.passing ?? 0) + (project.project?.tests?.skipped ?? 0) !== collected) {
	problems.push(
		`project.json: tests.passing ${project.project?.tests?.passing} + skipped ${project.project?.tests?.skipped} != claims ${collected}`,
	);
}
if (project.project?.commits !== commits) {
	problems.push(`project.json: commits ${project.project?.commits} != claims ${commits}`);
}

const pages = ['src/pages/index.astro', 'src/pages/story.astro', 'src/pages/about.astro'];
const imported = readJson('src/data/claims.json');
if (imported.tests?.collected !== collected || imported.repo?.commits !== commits) {
	problems.push('src/data/claims.json is not public/claims.json — copy it again');
}
for (const page of pages) {
	const body = read(page);
	if (!body.includes("import claims from '../data/claims.json'")) {
		problems.push(`${page}: the test count must come from claims.json, not from the page`);
	}
	const hardcoded = body.match(/TESTS_TOTAL\s*=\s*'[\d,]+'/);
	if (hardcoded) {
		problems.push(`${page}: ${hardcoded[0]} is a hardcoded count, import claims.json instead`);
	}
}

if (problems.length > 0) {
	console.error(`${problems.length} claims problem(s):`);
	for (const problem of problems) {
		console.error(`  - ${problem}`);
	}
	process.exit(1);
}

console.log(`claims consistent: ${collected?.toLocaleString('en-US')} tests, ${commits} commits`);

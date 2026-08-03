import { getArchivedProblems } from '$lib/server/potw.js';

export function load() {
    return {
        problems: getArchivedProblems().map(({ id, title, problem, answer, solution }) => ({
            id,
            title,
            problem,
            answer,
            solution
        }))
    };
}

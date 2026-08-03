import { getCurrentProblem } from '$lib/server/potw.js';

export function load() {
    const currentProblem = getCurrentProblem();

    return {
        potw: currentProblem
            ? { title: currentProblem.title, problem: currentProblem.problem }
            : null
    };
}

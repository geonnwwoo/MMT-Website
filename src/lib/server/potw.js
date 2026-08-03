const problems = [
    {
        id: 1,
        title: 'PoTW #1',
        problem: 'Let \\(a,b,c\\) be positive integers such that \\(a+b+c=12\\). Find the number of ordered triples \\((a,b,c)\\) with \\(a \\le b \\le c\\).',
        answer: '12',
        solution: 'We can find that when \\(a=1\\) there are \\(5\\) possible triples, 4 when \\(a=2\\), 2 when \\(a=3\\), and 1 when \\(a=4\\). Therefore, there is a total of \\(12\\) possible solutions.',
        submissionFormUrl: '',
        archived: false
        //to archive a problem, change archived: false to true
    }
];

export function getCurrentProblem() {
    return problems.find((problem) => !problem.archived) ?? null;
}

export function getArchivedProblems() {
    return problems.filter((problem) => problem.archived);
}

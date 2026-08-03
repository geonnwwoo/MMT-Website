import { json } from '@sveltejs/kit';
import { evaluate } from 'mathjs';
import { getCurrentProblem } from '$lib/server/potw.js';

const TOLERANCE = 1e-9;

function safeEvaluate(expr) {
    try {
        const value = evaluate(expr);
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            return { valid: false };
        }
        return { valid: true, value };
    } catch (err) {
        return { valid: false };
    }
}

function numbersMatch(a, b) {
    const diff = Math.abs(a - b);
    const scale = Math.max(1, Math.abs(a), Math.abs(b));
    return diff <= TOLERANCE * scale;
}

export async function POST({ request }) {
    const currentProblem = getCurrentProblem();
    if (!currentProblem) {
        return json({ feedback: 'unavailable' }, { status: 404 });
    }

    const body = await request.json();
    const answer = typeof body?.answer === 'string' ? body.answer : '';

    if (answer.trim() === '') {
        return json({ feedback: null });
    }

    const userResult = safeEvaluate(answer);
    if (!userResult.valid) {
        return json({ feedback: 'invalid' });
    }

    const correctResult = safeEvaluate(currentProblem.answer);
    if (!correctResult.valid) {
        console.error('The current PoTW answer failed to evaluate.');
        return json({ feedback: 'invalid' });
    }

    const feedback = numbersMatch(userResult.value, correctResult.value) ? 'correct' : 'incorrect';

    return json({ feedback });
}

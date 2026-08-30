import potwData from './server/potw.json';

export async function load() {

    // NOTE: this is secure. It checks the server's date, etc to see which
    // problem to display. User cannot manipulate their own device to access
    // problem or answer.

    const now = new Date();




    // START TIME. MODIFY TO CHANGE POTW SELECTION instead of server/potw.json
    const startDate = new Date('2026-08-30T08:00:00Z');
    const weekIndex = Math.floor((now-startDate)/(1000*60*60*24*7));
    const problemIndex = weekIndex % potwData.length;
    const latestPotw = potwData[problemIndex];
    const { answer, solution, ...safeLatestPotw } = latestPotw;

    return {
        potw: safeLatestPotw
    };
}

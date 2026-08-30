import potwData from '../server/potw.json';

export async function load() {
    
    // START TIME. MODIFY TO CHANGE POTW SELECTION instead of server/potw.json
    const startDate = new Date('2026-08-30T08:00:00Z');
    const now = new Date();
    const weekIndex = Math.floor((now-startDate)/(1000*60*60*24*7));
    const problemIndex = weekIndex % potwData.length;
    const archive = potwData.filter((_, index) => index < problemIndex).reverse();

    return {
        archive: archive
    };
}

function fail(message) {
    throw new Error(message);
}
const lines = text => text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
export function transform(s) {
    if (!s.trim()) fail('Enter some source text.');
    const ballots = lines(s).map(l => l.split('>').map(x => x.trim()));
    if (ballots.some(v => v.some(x => !x) || new Set(v).size !== v.length)) fail('Each ballot needs unique, named choices');
    const active = new Set(ballots.flat());
    const log = [];
    while (active.size) {
        const counts = new Map([...active].map(x => [x, 0]));
        let cast = 0;
        for (const b of ballots) {
            const x = b.find(v => active.has(v));
            if (x) {
                cast++;
                counts.set(x, counts.get(x) + 1)
            }
        }
        log.push([...counts].map(([k, v]) => k + ' ' + v).join(' / '));
        const winner = [...counts].find(([k, v]) => v > cast / 2);
        if (winner) {
            log.push('Winner: ' + winner[0]);
            break
        }
        const low = Math.min(...counts.values()),
            ties = [...counts].filter(x => x[1] === low);
        if (ties.length !== 1) {
            log.push('Elimination tie: ' + ties.map(x => x[0]).join(', '));
            break
        }
        active.delete(ties[0][0])
    }
    return log.join('\n')
}

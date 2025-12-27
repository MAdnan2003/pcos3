export function calculateCycleStats(logs) {
    if (!logs || logs.length < 2) {
      return {
        averageLength: null,
        shortestCycle: null,
        longestCycle: null,
        variability: null,
        lastPeriod: logs?.[0]?.date || null
      };
    }
  
    // Sort oldest → newest
    const sorted = [...logs].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  
    const cycleLengths = [];
  
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date);
      const curr = new Date(sorted[i].date);
      const diff =
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
  
      // PCOS-safe: ignore impossible cycles
      if (diff >= 15 && diff <= 90) {
        cycleLengths.push(diff);
      }
    }
  
    if (cycleLengths.length === 0) {
      return {
        averageLength: null,
        shortestCycle: null,
        longestCycle: null,
        variability: null,
        lastPeriod: sorted.at(-1).date
      };
    }
  
    const avg =
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  
    const min = Math.min(...cycleLengths);
    const max = Math.max(...cycleLengths);
  
    return {
      averageLength: Math.round(avg),
      shortestCycle: Math.round(min),
      longestCycle: Math.round(max),
      variability: Math.round(max - min),
      lastPeriod: sorted.at(-1).date
    };
  }
  
import { DailyChallenge, DailyChallengesState, ChallengeType } from '../components/DailyChallenges';

// Format YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate seeded pseudo-random number from date string
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate 3 balanced daily challenges for the given day
export function generateDailyChallenges(dateStr: string, currentPps: number): DailyChallenge[] {
  // Convert dateStr like '2026-09-24' to a numeric seed
  const numericSeed = dateStr.split('-').reduce((acc, part) => acc * 31 + parseInt(part, 10), 0);

  const ppsFactor = Math.max(currentPps, 5);

  const questPool: Array<{
    type: ChallengeType;
    icon: string;
    getTarget: (rnd: number) => number;
    titleSv: (t: number) => string;
    titleEn: (t: number) => string;
    descSv: (t: number) => string;
    descEn: (t: number) => string;
    rewardType: 'points' | 'buff_frenzy' | 'buff_speed';
    getRewardVal: (t: number, rnd: number) => number;
    getRewardLabelSv: (v: number) => string;
    getRewardLabelEn: (v: number) => string;
  }> = [
    {
      type: 'clicks',
      icon: '👆',
      getTarget: (rnd) => Math.floor(150 + rnd * 200), // 150 - 350 clicks
      titleSv: (t) => `Klicka ${t} gånger`,
      titleEn: (t) => `Click ${t} times`,
      descSv: (t) => `Gör ${t} manuella klick på skiten under dagen.`,
      descEn: (t) => `Perform ${t} manual clicks today.`,
      rewardType: 'points',
      getRewardVal: (_, rnd) => Math.round(ppsFactor * (120 + rnd * 60) + 500),
      getRewardLabelSv: (v) => `+${v.toLocaleString('sv-SE')} sp bonus`,
      getRewardLabelEn: (v) => `+${v.toLocaleString('en-US')} pp bonus`,
    },
    {
      type: 'buildings',
      icon: '🏭',
      getTarget: (rnd) => Math.floor(8 + rnd * 12), // 8 - 20 buildings
      titleSv: (t) => `Köp ${t} uppgraderingar`,
      titleEn: (t) => `Purchase ${t} upgrades`,
      descSv: (t) => `Investera i ${t} nya fabriker eller toaletter idag.`,
      descEn: (t) => `Invest in ${t} new factories or toilets today.`,
      rewardType: 'buff_frenzy',
      getRewardVal: () => 20, // 20s frenzy
      getRewardLabelSv: () => '🔥 20s Bajs-rusch (7x)',
      getRewardLabelEn: () => '🔥 20s Poop Frenzy (7x)',
    },
    {
      type: 'golden',
      icon: '🌟',
      getTarget: () => 2, // Catch 2 golden poops
      titleSv: (t) => `Fånga ${t} gyllene bajsar`,
      titleEn: (t) => `Catch ${t} Golden Poops`,
      descSv: (t) => `Håll utkik och klicka på ${t} flygande gyllene händelser.`,
      descEn: (t) => `Watch out and click ${t} floating golden events.`,
      rewardType: 'points',
      getRewardVal: (_, rnd) => Math.round(ppsFactor * (200 + rnd * 100) + 1500),
      getRewardLabelSv: (v) => `+${v.toLocaleString('sv-SE')} sp guldvinst`,
      getRewardLabelEn: (v) => `+${v.toLocaleString('en-US')} pp gold prize`,
    },
    {
      type: 'crits',
      icon: '💥',
      getTarget: (rnd) => Math.floor(10 + rnd * 15), // 10 - 25 crits
      titleSv: (t) => `Gör ${t} kritiska klick`,
      titleEn: (t) => `Trigger ${t} Critical Clicks`,
      descSv: (t) => `Klicka snabbt med Stark Jalapeño för ${t} eldklick!`,
      descEn: (t) => `Click swiftly with Hot Sauce to land ${t} critical hits!`,
      rewardType: 'points',
      getRewardVal: (_, rnd) => Math.round(ppsFactor * (150 + rnd * 80) + 800),
      getRewardLabelSv: (v) => `+${v.toLocaleString('sv-SE')} sp hett klick`,
      getRewardLabelEn: (v) => `+${v.toLocaleString('en-US')} pp spicy prize`,
    },
  ];

  // Pick 3 quests deterministically
  const quests: DailyChallenge[] = [];
  const pickedIndices = new Set<number>();

  for (let i = 0; i < 3; i++) {
    let pick = Math.floor(pseudoRandom(numericSeed + i * 17) * questPool.length);
    while (pickedIndices.has(pick)) {
      pick = (pick + 1) % questPool.length;
    }
    pickedIndices.add(pick);

    const template = questPool[pick];
    const rnd = pseudoRandom(numericSeed + i * 29);
    const target = template.getTarget(rnd);
    const rewardVal = template.getRewardVal(target, rnd);

    quests.push({
      id: `${dateStr}_q${i + 1}`,
      type: template.type,
      titleSv: template.titleSv(target),
      titleEn: template.titleEn(target),
      descSv: template.descSv(target),
      descEn: template.descEn(target),
      icon: template.icon,
      target,
      current: 0,
      completed: false,
      claimed: false,
      rewardType: template.rewardType,
      rewardValue: rewardVal,
      rewardLabelSv: template.getRewardLabelSv(rewardVal),
      rewardLabelEn: template.getRewardLabelEn(rewardVal),
    });
  }

  return quests;
}

// Check or advance streak
export function checkStreak(
  lastCompletedDate: string | undefined,
  currentStreak: number,
  todayStr: string
): number {
  if (!lastCompletedDate) return 1;
  const last = new Date(lastCompletedDate);
  const today = new Date(todayStr);
  const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return currentStreak + 1; // Kept streak
  } else if (diffDays === 0) {
    return currentStreak; // Same day
  } else {
    return 1; // Streak broken, restart at 1
  }
}

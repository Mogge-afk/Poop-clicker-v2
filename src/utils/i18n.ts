export type Language = 'sv' | 'en';

export interface Translations {
  title: string;
  subtitle: string;
  pointsName: string;
  perSecond: string;
  perClick: string;
  spaceHint: string;
  frenzyActive: string;
  cheatDetected: string;
  // Poop-o-Meter
  meterTitle: string;
  meterClicks: string;
  meterReward: string;
  meterNext: string;
  meterBonusReady: string;
  meterFrenzyTriggered: string;
  // Headers & buttons
  sound: string;
  music: string;
  stats: string;
  achievements: string;
  skins: string;
  settings: string;
  dayMode: string;
  nightMode: string;
  // Upgrade store
  storeTitle: string;
  sortDefault: string;
  sortPrice: string;
  sortExpensive: string;
  sortRoi: string;
  nextMilestone: string;
  specialBoostsTitle: string;
  oneTimePurchase: string;
  boughtActive: string;
  buyNow: string;
  required: string;
  // Prestige
  prestigeButton: string;
  prestigeDesc: string;
  prestigeToast: string;
  // Boost item names & descriptions
  boosts: {
    laxTitle: string;
    laxTag: string;
    laxDesc: string;
    coffeeTitle: string;
    coffeeTag: string;
    coffeeDesc: string;
    hotSauceTitle: string;
    hotSauceTag: string;
    hotSauceDesc: string;
    softTpTitle: string;
    softTpTag: string;
    softTpDesc: string;
    plungerTitle: string;
    plungerTag: string;
    plungerDesc: string;
    goldenCornTitle: string;
    goldenCornTag: string;
    goldenCornDesc: string;
    fiberTitle: string;
    fiberTag: string;
    fiberDesc: string;
  };
  // Settings & Language modal
  langLabel: string;
  swedish: string;
  english: string;
  colorTheme: string;
  darkModeActive: string;
  lightModeActive: string;
  offlineWelcome: string;
  offlineClaim: string;
  offlineDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  sv: {
    title: 'Poop Clicker',
    subtitle: '...Deluxe 💩',
    pointsName: 'skitpoäng',
    perSecond: 'sp/sek',
    perClick: 'sp per klick',
    spaceHint: '(Tips: Tryck Mellanslag)',
    frenzyActive: 'BAJS-RUSCH AKTIV! (7x)',
    cheatDetected: '🚨 Autoclicker detekterad! Skiten sprider sig över skärmen!',
    // Poop-o-Meter
    meterTitle: 'Poop-o-Meter',
    meterClicks: 'klick till bonus',
    meterReward: 'MILSTOLPE NÅDD!',
    meterNext: 'Nästa mål',
    meterBonusReady: 'KLICK-BONUS UTLÖST!',
    meterFrenzyTriggered: '🎉 Milstolpe nådd! Du belönades med bonuspoäng!',
    // Headers & buttons
    sound: 'Ljud',
    music: 'Musik',
    stats: 'Stats',
    achievements: 'Framsteg',
    skins: 'Skins',
    settings: 'Inställningar',
    dayMode: 'Dag',
    nightMode: 'Natt',
    // Upgrade store
    storeTitle: 'Fabriker & Uppgraderingar',
    sortDefault: 'Standard',
    sortPrice: 'Billigast först',
    sortExpensive: 'Dyrast först',
    sortRoi: 'Bästa ROI',
    nextMilestone: 'Nästa',
    specialBoostsTitle: 'Special-boostar & Power-ups',
    oneTimePurchase: 'Engångsköp',
    boughtActive: 'KÖPT & AKTIV',
    buyNow: 'Köp nu',
    required: 'Krävs',
    // Prestige
    prestigeButton: 'Prestige till Nivå',
    prestigeDesc: 'Spola toaletten! Nollställer uppgraderingar och rund-boostar, men behåller startpoäng, permanent Fiber-Boost & ger permanent högre produktion!',
    prestigeToast: '🚽 SLURP! Du spolade toaletten & nådde Prestige Nivå',
    // Boost items
    boosts: {
      laxTitle: 'Laxermedel Chock',
      laxTag: 'Rund-boost',
      laxDesc: 'Öka nuvarande poäng med 5x direkt!',
      coffeeTitle: 'Morgonkaffe (Espresso)',
      coffeeTag: 'Rund-boost',
      coffeeDesc: '+25% snabbare passiv produktion under denna omgång!',
      hotSauceTitle: 'Stark Jalapeño-sås',
      hotSauceTag: 'Rund-boost',
      hotSauceDesc: '10% chans för 5x kritiska klick med eld-effekt!',
      softTpTitle: 'Dubbellagers Toapapper',
      softTpTag: 'Rund-boost',
      softTpDesc: '10% permanent rabatt på alla byggnader i omgången!',
      plungerTitle: 'Turbo-Vaskrensare',
      plungerTag: 'Rund-boost',
      plungerDesc: 'Manuella klick ger direkt +2% av din totala sekundproduktion (PPS)!',
      goldenCornTitle: 'Gyllene Majskorn',
      goldenCornTag: 'Rund-boost',
      goldenCornDesc: 'Gyllene bajs flyger dubbelt så ofta och stannar +5s längre på skärmen!',
      fiberTitle: 'Permanent Fiber-Boost',
      fiberTag: 'PERMANENT',
      fiberDesc: 'Ger +15% passiv produktion PERMANENT (behålls även efter Prestige & Spolning)!',
    },
    langLabel: 'Språk / Language',
    swedish: 'Svenska 🇸🇪',
    english: 'English 🇬🇧',
    colorTheme: 'Färgtema (Dag / Natt)',
    darkModeActive: 'Nattläge aktivt (standard)',
    lightModeActive: 'Dagläge aktivt',
    offlineWelcome: 'Välkommen tillbaka!',
    offlineClaim: 'Hämta mina skitpoäng',
    offlineDesc: 'Dina fabriker och toaletter har arbetat medan du var borta:',
  },
  en: {
    title: 'Poop Clicker',
    subtitle: '...Deluxe 💩',
    pointsName: 'poop points',
    perSecond: 'pp/sec',
    perClick: 'pp per click',
    spaceHint: '(Tip: Press Spacebar)',
    frenzyActive: 'POOP FRENZY ACTIVE! (7x)',
    cheatDetected: '🚨 Autoclicker detected! Mess spreading everywhere!',
    // Poop-o-Meter
    meterTitle: 'Poop-o-Meter',
    meterClicks: 'clicks to milestone',
    meterReward: 'MILESTONE REACHED!',
    meterNext: 'Next target',
    meterBonusReady: 'CLICK BONUS UNLEASHED!',
    meterFrenzyTriggered: '🎉 Milestone reached! Bonus points awarded!',
    // Headers & buttons
    sound: 'Sound',
    music: 'Music',
    stats: 'Stats',
    achievements: 'Badges',
    skins: 'Skins',
    settings: 'Settings',
    dayMode: 'Day',
    nightMode: 'Night',
    // Upgrade store
    storeTitle: 'Factories & Upgrades',
    sortDefault: 'Default',
    sortPrice: 'Cheapest first',
    sortExpensive: 'Priciest first',
    sortRoi: 'Best ROI',
    nextMilestone: 'Next',
    specialBoostsTitle: 'Special Boosts & Power-ups',
    oneTimePurchase: 'Single Purchase',
    boughtActive: 'PURCHASED & ACTIVE',
    buyNow: 'Buy now',
    required: 'Requires',
    // Prestige
    prestigeButton: 'Prestige to Level',
    prestigeDesc: 'Flush the toilet! Resets round upgrades, but keeps starting points, permanent Fiber-Boost & permanently multiplies production!',
    prestigeToast: '🚽 SWOOSH! Toilet flushed! Prestige Level',
    // Boost items
    boosts: {
      laxTitle: 'Laxative Shock',
      laxTag: 'Round Boost',
      laxDesc: 'Instantly multiply your current bank points by 5x!',
      coffeeTitle: 'Morning Coffee (Espresso)',
      coffeeTag: 'Round Boost',
      coffeeDesc: '+25% faster passive production during this round!',
      hotSauceTitle: 'Hot Jalapeño Sauce',
      hotSauceTag: 'Round Boost',
      hotSauceDesc: '10% chance for 5x critical clicks with flame blast!',
      softTpTitle: 'Double-Ply Toilet Paper',
      softTpTag: 'Round Boost',
      softTpDesc: '10% permanent discount on all buildings this round!',
      plungerTitle: 'Turbo Plunger',
      plungerTag: 'Round Boost',
      plungerDesc: 'Manual clicks gain +2% of your total PPS output!',
      goldenCornTitle: 'Golden Corn',
      goldenCornTag: 'Round Boost',
      goldenCornDesc: 'Golden events spawn 2x as fast and stay +5s longer!',
      fiberTitle: 'Permanent Fiber-Boost',
      fiberTag: 'PERMANENT',
      fiberDesc: 'Grants +15% passive production PERMANENTLY (persists through Prestige Flushes)!',
    },
    langLabel: 'Language / Språk',
    swedish: 'Svenska 🇸🇪',
    english: 'English 🇬🇧',
    colorTheme: 'Color Theme (Day / Night)',
    darkModeActive: 'Night Mode active (default)',
    lightModeActive: 'Day Mode active',
    offlineWelcome: 'Welcome Back!',
    offlineClaim: 'Claim My Poop Points',
    offlineDesc: 'Your toilets and factories kept producing while you were away:',
  },
};

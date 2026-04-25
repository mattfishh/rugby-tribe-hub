import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type CharacterClass = 'king' | 'knight' | 'rogue' | 'wizard' | 'assassin';
type Faction = 'raccoon' | 'dawg';
type MoveKind = 'attack' | 'stat';
type StatName = 'offense' | 'defense' | 'speed';
type BattleMode = 'command' | 'fight' | 'item' | 'switch' | 'won' | 'lost' | 'escaped';
type ActorSide = 'player' | 'enemy';
type AnimationKind = 'lunge' | 'pulse';

interface Move {
  id: string;
  name: string;
  kind: MoveKind;
  power?: number;
  accuracy: number;
  description: string;
  target: 'self' | 'enemy';
  statChanges?: Partial<Record<StatName, number>>;
}

interface Combatant {
  id: string;
  name: string;
  faction: Faction;
  characterClass: CharacterClass;
  sprite: string;
  level: number;
  maxHp: number;
  hp: number;
  offense: number;
  defense: number;
  speed: number;
  moves: Move[];
  mods: Record<StatName, number>;
}

interface Inventory {
  potion: number;
  superPotion: number;
}

interface BattleState {
  playerTeam: Combatant[];
  enemyTeam: Combatant[];
  activePlayer: number;
  activeEnemy: number;
  inventory: Inventory;
  mode: BattleMode;
  log: string[];
  turn: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (percent: number) => Math.random() * 100 <= percent;
const statMultiplier = (stage: number) => 1 + stage * 0.25;
const isStanding = (combatant: Combatant) => combatant.hp > 0;
const pause = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const createBattleHp = () => roll(50, 70);

const move = (
  id: string,
  name: string,
  kind: MoveKind,
  description: string,
  options: Omit<Move, 'id' | 'name' | 'kind' | 'description'>,
): Move => ({
  id,
  name,
  kind,
  description,
  ...options,
});

const spritePath = (fileName: string) => `/images/battle/sprites/${fileName}`;

const RACCOON_TEAM: Combatant[] = [
  {
    id: 'king-raccoon',
    name: 'King Raccoon',
    faction: 'raccoon',
    characterClass: 'king',
    sprite: spritePath('king-raccoon.png'),
    level: 5,
    maxHp: 38,
    hp: 38,
    offense: 15,
    defense: 14,
    speed: 10,
    mods: { offense: 0, defense: 0, speed: 0 },
    moves: [
      move('royal-swipe', 'Royal Swipe', 'attack', 'A steady crowned claw attack.', { target: 'enemy', power: 14, accuracy: 94 }),
      move('crown-bash', 'Crown Bash', 'attack', 'A heavier hit from the throne.', { target: 'enemy', power: 18, accuracy: 84 }),
      move('rally', 'Rally', 'stat', 'Raise offense and defense.', {
        target: 'self',
        accuracy: 100,
        statChanges: { offense: 1, defense: 1 },
      }),
      move('commanding-stare', 'Commanding Stare', 'stat', 'Lower the enemy offense.', {
        target: 'enemy',
        accuracy: 90,
        statChanges: { offense: -1 },
      }),
    ],
  },
  {
    id: 'knight-raccoon',
    name: 'Knight Raccoon',
    faction: 'raccoon',
    characterClass: 'knight',
    sprite: spritePath('knight-raccoon.png'),
    level: 5,
    maxHp: 40,
    hp: 40,
    offense: 13,
    defense: 18,
    speed: 8,
    mods: { offense: 0, defense: 0, speed: 0 },
    moves: [
      move('shield-bash', 'Shield Bash', 'attack', 'A reliable armored attack.', { target: 'enemy', power: 13, accuracy: 94 }),
      move('lance-pounce', 'Lance Pounce', 'attack', 'A solid hit with extra weight.', {
        target: 'enemy',
        power: 16,
        accuracy: 88,
      }),
      move('fortify', 'Fortify', 'stat', 'Raise defense sharply.', {
        target: 'self',
        accuracy: 100,
        statChanges: { defense: 2 },
      }),
      move('challenge', 'Challenge', 'stat', 'Lower the enemy offense.', {
        target: 'enemy',
        accuracy: 90,
        statChanges: { offense: -1 },
      }),
    ],
  },
  {
    id: 'rogue-raccoon',
    name: 'Rogue Raccoon',
    faction: 'raccoon',
    characterClass: 'rogue',
    sprite: spritePath('rogue-raccoon.png'),
    level: 5,
    maxHp: 32,
    hp: 32,
    offense: 16,
    defense: 10,
    speed: 18,
    mods: { offense: 0, defense: 0, speed: 0 },
    moves: [
      move('quick-nip', 'Quick Nip', 'attack', 'A fast, light attack.', { target: 'enemy', power: 10, accuracy: 100 }),
      move('back-alley-swipe', 'Back Alley Swipe', 'attack', 'A risky, nasty slash.', { target: 'enemy', power: 18, accuracy: 82 }),
      move('smoke-feint', 'Smoke Feint', 'stat', 'Lower the enemy defense and speed.', {
        target: 'enemy',
        accuracy: 86,
        statChanges: { defense: -1, speed: -1 },
      }),
      move('sharpen-claws', 'Sharpen Claws', 'stat', 'Raise offense.', {
        target: 'self',
        accuracy: 100,
        statChanges: { offense: 2 },
      }),
    ],
  },
  {
    id: 'wizard-raccoon',
    name: 'Wizard Raccoon',
    faction: 'raccoon',
    characterClass: 'wizard',
    sprite: spritePath('wizard-raccoon.png'),
    level: 5,
    maxHp: 34,
    hp: 34,
    offense: 15,
    defense: 12,
    speed: 13,
    mods: { offense: 0, defense: 0, speed: 0 },
    moves: [
      move('arcane-acorn', 'Arcane Acorn', 'attack', 'A reliable magical toss.', { target: 'enemy', power: 13, accuracy: 96 }),
      move('moonbeam', 'Moonbeam', 'attack', 'A bright hit with bite.', { target: 'enemy', power: 17, accuracy: 86 }),
      move('mystic-ward', 'Mystic Ward', 'stat', 'Raise defense.', {
        target: 'self',
        accuracy: 100,
        statChanges: { defense: 2 },
      }),
      move('hex', 'Hex', 'stat', 'Lower enemy offense and defense.', {
        target: 'enemy',
        accuracy: 84,
        statChanges: { offense: -1, defense: -1 },
      }),
    ],
  },
];

type DawgClass = 'assassin' | 'king' | 'knight' | 'wizard';

const DAWG_MOVE_POOLS: Record<DawgClass, Move[]> = {
  assassin: [
    move('shadow-chomp', 'Shadow Chomp', 'attack', 'A fast bite from nowhere.', { target: 'enemy', power: 14, accuracy: 94 }),
    move('sneak-rush', 'Sneak Rush', 'attack', 'A risky speed strike.', { target: 'enemy', power: 18, accuracy: 82 }),
    move('prowl', 'Prowl', 'stat', 'Raise offense and speed.', { target: 'self', accuracy: 100, statChanges: { offense: 1, speed: 1 } }),
    move('dirty-trick', 'Dirty Trick', 'stat', 'Lower enemy defense.', { target: 'enemy', accuracy: 88, statChanges: { defense: -1 } }),
  ],
  king: [
    move('royal-bark', 'Royal Bark', 'attack', 'A commanding blast.', { target: 'enemy', power: 15, accuracy: 92 }),
    move('throne-tackle', 'Throne Tackle', 'attack', 'A big royal hit.', { target: 'enemy', power: 19, accuracy: 80 }),
    move('decree', 'Decree', 'stat', 'Raise offense.', { target: 'self', accuracy: 100, statChanges: { offense: 2 } }),
    move('intimidate', 'Intimidate', 'stat', 'Lower enemy offense.', { target: 'enemy', accuracy: 88, statChanges: { offense: -1 } }),
  ],
  knight: [
    move('armor-bite', 'Armor Bite', 'attack', 'A reliable armored bite.', { target: 'enemy', power: 13, accuracy: 94 }),
    move('guard-rush', 'Guard Rush', 'attack', 'A sturdy charging hit.', { target: 'enemy', power: 16, accuracy: 88 }),
    move('brace', 'Brace', 'stat', 'Raise defense sharply.', { target: 'self', accuracy: 100, statChanges: { defense: 2 } }),
    move('shield-growl', 'Shield Growl', 'stat', 'Lower enemy offense.', { target: 'enemy', accuracy: 90, statChanges: { offense: -1 } }),
  ],
  wizard: [
    move('spell-bark', 'Spell Bark', 'attack', 'A strange magical bark.', { target: 'enemy', power: 13, accuracy: 96 }),
    move('star-fetch', 'Star Fetch', 'attack', 'A bright magical strike.', { target: 'enemy', power: 17, accuracy: 86 }),
    move('ward', 'Ward', 'stat', 'Raise defense.', { target: 'self', accuracy: 100, statChanges: { defense: 2 } }),
    move('jinx', 'Jinx', 'stat', 'Lower enemy offense and speed.', {
      target: 'enemy',
      accuracy: 84,
      statChanges: { offense: -1, speed: -1 },
    }),
  ],
};

const DAWG_BASES: Record<DawgClass, Omit<Combatant, 'id' | 'level' | 'hp' | 'moves' | 'mods'>> = {
  assassin: {
    name: 'Assassin Dawg',
    faction: 'dawg',
    characterClass: 'assassin',
    sprite: spritePath('assassin-dawg.png'),
    maxHp: 30,
    offense: 16,
    defense: 10,
    speed: 18,
  },
  king: {
    name: 'King Dawg',
    faction: 'dawg',
    characterClass: 'king',
    sprite: spritePath('king-dawg.png'),
    maxHp: 38,
    offense: 15,
    defense: 14,
    speed: 10,
  },
  knight: {
    name: 'Knight Dawg',
    faction: 'dawg',
    characterClass: 'knight',
    sprite: spritePath('knight-dawg.png'),
    maxHp: 42,
    offense: 13,
    defense: 18,
    speed: 8,
  },
  wizard: {
    name: 'Wizard Dawg',
    faction: 'dawg',
    characterClass: 'wizard',
    sprite: spritePath('wizard-dawg.png'),
    maxHp: 34,
    offense: 15,
    defense: 12,
    speed: 13,
  },
};

const cloneCombatant = (combatant: Combatant): Combatant => ({
  ...combatant,
  moves: combatant.moves.map((knownMove) => ({ ...knownMove })),
  mods: { ...combatant.mods },
});

const createPlayerCombatant = (combatant: Combatant): Combatant => {
  const hp = createBattleHp();

  return {
    ...cloneCombatant(combatant),
    maxHp: hp,
    hp,
  };
};

const createEnemy = (dawgClass: DawgClass, index: number): Combatant => {
  const base = DAWG_BASES[dawgClass];
  const level = roll(4, 6);
  const hp = createBattleHp();

  return {
    ...base,
    id: `${dawgClass}-dawg-${index}-${Date.now()}`,
    level,
    maxHp: hp,
    hp,
    offense: base.offense + (level - 5) + roll(-1, 1),
    defense: base.defense + (level - 5) + roll(-1, 1),
    speed: base.speed + (level - 5) + roll(-1, 1),
    moves: DAWG_MOVE_POOLS[dawgClass].map((knownMove) => ({ ...knownMove })),
    mods: { offense: 0, defense: 0, speed: 0 },
  };
};

const createEnemyTeam = () =>
  [...(['assassin', 'king', 'knight', 'wizard'] as DawgClass[])]
    .sort(() => Math.random() - 0.5)
    .map(createEnemy);

const createBattle = (): BattleState => ({
  playerTeam: RACCOON_TEAM.map(createPlayerCombatant),
  enemyTeam: createEnemyTeam(),
  activePlayer: 0,
  activeEnemy: 0,
  inventory: { potion: 3, superPotion: 1 },
  mode: 'command',
  log: ['A rival dawg team wanders onto the pitch. Choose your first move.'],
  turn: 1,
});

const addLog = (state: BattleState, entries: string[]) => ({
  ...state,
  log: [...entries, ...state.log].slice(0, 8),
});

const getEffectiveStat = (combatant: Combatant, stat: StatName) =>
  Math.max(1, Math.round(combatant[stat] * statMultiplier(combatant.mods[stat])));

const calculateDamage = (attacker: Combatant, defender: Combatant, selectedMove: Move) => {
  const offense = getEffectiveStat(attacker, 'offense');
  const defense = getEffectiveStat(defender, 'defense');
  const variance = roll(85, 100) / 100;
  const raw = ((selectedMove.power ?? 0) + offense * 1.35 - defense * 0.65) * (attacker.level / 5) * variance;

  return Math.max(1, Math.floor(raw));
};

const applyMove = (attacker: Combatant, defender: Combatant, selectedMove: Move) => {
  const nextAttacker = cloneCombatant(attacker);
  const nextDefender = cloneCombatant(defender);
  const messages: string[] = [`${attacker.name} used ${selectedMove.name}.`];

  if (!chance(selectedMove.accuracy)) {
    messages.push(selectedMove.target === 'self' ? `${selectedMove.name} move failed.` : 'It missed.');
    return { attacker: nextAttacker, defender: nextDefender, messages };
  }

  if (selectedMove.kind === 'attack') {
    const damage = calculateDamage(nextAttacker, nextDefender, selectedMove);
    nextDefender.hp = clamp(nextDefender.hp - damage, 0, nextDefender.maxHp);
    messages.push(`${nextDefender.name} took ${damage} damage.`);
  }

  if (selectedMove.statChanges) {
    const target = selectedMove.target === 'self' ? nextAttacker : nextDefender;
    Object.entries(selectedMove.statChanges).forEach(([stat, amount]) => {
      const statName = stat as StatName;
      const before = target.mods[statName];
      target.mods[statName] = clamp(before + amount, -3, 3);
      if (target.mods[statName] === before) {
        messages.push(`${target.name}'s ${statName} will not budge.`);
      } else {
        messages.push(`${target.name}'s ${statName} ${amount > 0 ? 'rose' : 'fell'}.`);
      }
    });
  }

  return { attacker: nextAttacker, defender: nextDefender, messages };
};

const firstStandingIndex = (team: Combatant[]) => team.findIndex(isStanding);

const chooseEnemyMove = (enemy: Combatant, player: Combatant) => {
  const attacks = enemy.moves.filter((knownMove) => knownMove.kind === 'attack');
  const statMoves = enemy.moves.filter((knownMove) => knownMove.kind === 'stat');

  if (player.hp <= player.maxHp * 0.35) {
    return attacks[roll(0, attacks.length - 1)];
  }

  if (enemy.mods.offense < 1 && chance(30)) {
    const offenseMove = statMoves.find((knownMove) => knownMove.target === 'self' && knownMove.statChanges?.offense);
    if (offenseMove) return offenseMove;
  }

  if (enemy.hp <= enemy.maxHp * 0.45 && enemy.mods.defense < 2 && chance(35)) {
    const defenseMove = statMoves.find((knownMove) => knownMove.target === 'self' && knownMove.statChanges?.defense);
    if (defenseMove) return defenseMove;
  }

  return enemy.moves[roll(0, enemy.moves.length - 1)];
};

const finishTurn = (state: BattleState, messages: string[]): BattleState => {
  const activePlayer = state.playerTeam[state.activePlayer];
  const activeEnemy = state.enemyTeam[state.activeEnemy];

  if (!isStanding(activeEnemy)) {
    const nextEnemy = state.enemyTeam.findIndex((enemy, index) => index > state.activeEnemy && isStanding(enemy));
    if (nextEnemy === -1) {
      return addLog({ ...state, mode: 'won' }, [...messages, 'The rival dawg team is out. You win the run.']);
    }

    return addLog(
      { ...state, activeEnemy: nextEnemy, mode: 'command', turn: state.turn + 1 },
      [...messages, `${state.enemyTeam[nextEnemy].name} enters the battle.`],
    );
  }

  if (!isStanding(activePlayer)) {
    if (firstStandingIndex(state.playerTeam) === -1) {
      return addLog({ ...state, mode: 'lost' }, [...messages, 'All four raccoons are down. The run is over.']);
    }

    return addLog({ ...state, mode: 'switch' }, [...messages, `${activePlayer.name} fainted. Choose another raccoon.`]);
  }

  return addLog({ ...state, mode: 'command', turn: state.turn + 1 }, messages);
};

const runEnemyTurn = (state: BattleState, messages: string[]): BattleState => {
  const playerTeam = state.playerTeam.map(cloneCombatant);
  const enemyTeam = state.enemyTeam.map(cloneCombatant);
  const player = playerTeam[state.activePlayer];
  const enemy = enemyTeam[state.activeEnemy];
  const enemyMove = chooseEnemyMove(enemy, player);
  const result = applyMove(enemy, player, enemyMove);

  enemyTeam[state.activeEnemy] = result.attacker;
  playerTeam[state.activePlayer] = result.defender;

  return finishTurn({ ...state, playerTeam, enemyTeam }, [...messages, ...result.messages]);
};

const usePlayerMove = (state: BattleState, selectedMove: Move): BattleState => {
  const playerTeam = state.playerTeam.map(cloneCombatant);
  const enemyTeam = state.enemyTeam.map(cloneCombatant);
  const player = playerTeam[state.activePlayer];
  const enemy = enemyTeam[state.activeEnemy];
  const playerSpeed = getEffectiveStat(player, 'speed') + roll(-2, 2);
  const enemySpeed = getEffectiveStat(enemy, 'speed') + roll(-2, 2);

  if (enemySpeed > playerSpeed) {
    const enemyMove = chooseEnemyMove(enemy, player);
    const enemyResult = applyMove(enemy, player, enemyMove);
    enemyTeam[state.activeEnemy] = enemyResult.attacker;
    playerTeam[state.activePlayer] = enemyResult.defender;

    if (!isStanding(playerTeam[state.activePlayer])) {
      return finishTurn({ ...state, playerTeam, enemyTeam }, enemyResult.messages);
    }

    const playerResult = applyMove(playerTeam[state.activePlayer], enemyTeam[state.activeEnemy], selectedMove);
    playerTeam[state.activePlayer] = playerResult.attacker;
    enemyTeam[state.activeEnemy] = playerResult.defender;
    return finishTurn({ ...state, playerTeam, enemyTeam }, [...enemyResult.messages, ...playerResult.messages]);
  }

  const playerResult = applyMove(player, enemy, selectedMove);
  playerTeam[state.activePlayer] = playerResult.attacker;
  enemyTeam[state.activeEnemy] = playerResult.defender;

  if (!isStanding(enemyTeam[state.activeEnemy])) {
    return finishTurn({ ...state, playerTeam, enemyTeam }, playerResult.messages);
  }

  const enemyMove = chooseEnemyMove(enemyTeam[state.activeEnemy], playerTeam[state.activePlayer]);
  const enemyResult = applyMove(enemyTeam[state.activeEnemy], playerTeam[state.activePlayer], enemyMove);
  enemyTeam[state.activeEnemy] = enemyResult.attacker;
  playerTeam[state.activePlayer] = enemyResult.defender;

  return finishTurn({ ...state, playerTeam, enemyTeam }, [...playerResult.messages, ...enemyResult.messages]);
};

const applyMoveToBattle = (state: BattleState, actorSide: ActorSide, selectedMove: Move) => {
  const playerTeam = state.playerTeam.map(cloneCombatant);
  const enemyTeam = state.enemyTeam.map(cloneCombatant);
  const player = playerTeam[state.activePlayer];
  const enemy = enemyTeam[state.activeEnemy];

  if (actorSide === 'player') {
    const result = applyMove(player, enemy, selectedMove);
    playerTeam[state.activePlayer] = result.attacker;
    enemyTeam[state.activeEnemy] = result.defender;

    return {
      state: { ...state, playerTeam, enemyTeam },
      messages: result.messages.slice(1),
      targetDown: !isStanding(result.defender),
    };
  }

  const result = applyMove(enemy, player, selectedMove);
  enemyTeam[state.activeEnemy] = result.attacker;
  playerTeam[state.activePlayer] = result.defender;

  return {
    state: { ...state, playerTeam, enemyTeam },
    messages: result.messages.slice(1),
    targetDown: !isStanding(result.defender),
  };
};

const applyPotionToBattle = (state: BattleState, item: keyof Inventory) => {
  const healAmount = item === 'potion' ? 25 : 50;
  const playerTeam = state.playerTeam.map(cloneCombatant);
  const player = playerTeam[state.activePlayer];
  const healed = Math.min(healAmount, player.maxHp - player.hp);

  player.hp = clamp(player.hp + healAmount, 0, player.maxHp);
  playerTeam[state.activePlayer] = player;

  return {
    state: {
      ...state,
      playerTeam,
      inventory: { ...state.inventory, [item]: state.inventory[item] - 1 },
    },
    messages: [`${player.name} recovered ${healed} HP.`],
  };
};

const usePotion = (state: BattleState, item: keyof Inventory): BattleState => {
  if (state.inventory[item] <= 0) {
    return addLog({ ...state, mode: 'command' }, ['No potions left.']);
  }

  const healAmount = item === 'potion' ? 25 : 50;
  const playerTeam = state.playerTeam.map(cloneCombatant);
  const player = playerTeam[state.activePlayer];
  const healed = Math.min(healAmount, player.maxHp - player.hp);

  player.hp = clamp(player.hp + healAmount, 0, player.maxHp);
  playerTeam[state.activePlayer] = player;

  return runEnemyTurn(
    {
      ...state,
      playerTeam,
      inventory: { ...state.inventory, [item]: state.inventory[item] - 1 },
    },
    [`${player.name} recovered ${healed} HP.`],
  );
};

const switchToRaccoon = (state: BattleState, index: number): BattleState => {
  const next = state.playerTeam[index];

  if (!next || !isStanding(next) || index === state.activePlayer) {
    return state;
  }

  const forcedSwitch = !isStanding(state.playerTeam[state.activePlayer]);
  const switchedState = { ...state, activePlayer: index, mode: 'command' as BattleMode };
  const message = [`Go, ${next.name}.`];

  if (forcedSwitch) {
    return addLog(switchedState, message);
  }

  return runEnemyTurn(switchedState, message);
};

const hpPercent = (combatant: Combatant) => `${(combatant.hp / combatant.maxHp) * 100}%`;

const describeStatChanges = (selectedMove: Move) => {
  if (!selectedMove.statChanges) return 'None';

  return Object.entries(selectedMove.statChanges)
    .map(([stat, amount]) => `${amount > 0 ? '+' : ''}${amount} ${stat}`)
    .join(', ');
};

const menuButtonClass =
  'min-h-14 justify-start whitespace-normal border-2 border-[#c8bfae] bg-[#f8f4eb] px-5 py-3 text-left text-[10px] leading-relaxed text-[#171411] shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-white disabled:translate-y-0 disabled:opacity-45';

const infoButtonClass =
  'flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#c8bfae] bg-[#f8f4eb] text-[#171411] shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171411]';

const MoveInfoButton = ({ selectedMove }: { selectedMove: Move }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className={infoButtonClass}
        aria-label={`${selectedMove.name} details`}
      >
        <Info className="h-5 w-5" />
      </button>
    </DialogTrigger>
    <DialogContent className="battle-pixel border-4 border-[#b88b45] bg-[#f8f4eb] text-[#171411]">
      <DialogHeader>
        <DialogTitle className="text-[15px] leading-relaxed text-[#171411]">{selectedMove.name}</DialogTitle>
        <DialogDescription className="text-[10px] leading-relaxed text-[#3a3127]">
          {selectedMove.description}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 text-[10px] leading-relaxed">
        <p>Type: {selectedMove.kind === 'attack' ? 'Attack' : 'Stat'}</p>
        <p>Target: {selectedMove.target === 'self' ? 'Self' : 'Enemy'}</p>
        <p>Power: {selectedMove.power ?? '-'}</p>
        <p>Accuracy: {selectedMove.accuracy}%</p>
        <p>Stats: {describeStatChanges(selectedMove)}</p>
      </div>
    </DialogContent>
  </Dialog>
);

const ItemInfoButton = ({
  name,
  healAmount,
  description,
}: {
  name: string;
  healAmount: number;
  description: string;
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className={infoButtonClass}
        aria-label={`${name} details`}
      >
        <Info className="h-5 w-5" />
      </button>
    </DialogTrigger>
    <DialogContent className="battle-pixel border-4 border-[#b88b45] bg-[#f8f4eb] text-[#171411]">
      <DialogHeader>
        <DialogTitle className="text-[15px] leading-relaxed text-[#171411]">{name}</DialogTitle>
        <DialogDescription className="text-[10px] leading-relaxed text-[#3a3127]">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 text-[10px] leading-relaxed">
        <p>Effect: Restore {healAmount} HP</p>
        <p>Cost: Uses your turn</p>
        <p>Speed: Always before the dawg</p>
      </div>
    </DialogContent>
  </Dialog>
);

const Sprite = ({
  combatant,
  side,
  isAnimating,
  animationKind,
}: {
  combatant: Combatant;
  side: ActorSide;
  isAnimating: boolean;
  animationKind: AnimationKind;
}) => (
  <div
    className={cn(
      'relative flex h-44 w-48 items-end justify-center sm:h-64 sm:w-72',
      side === 'enemy' && 'sm:h-60 sm:w-[17rem]',
      isAnimating && animationKind === 'pulse' && 'battle-pulse',
      isAnimating && animationKind === 'lunge' && side === 'player' && 'battle-lunge-player',
      isAnimating && animationKind === 'lunge' && side === 'enemy' && 'battle-lunge-enemy',
    )}
  >
    <img
      src={combatant.sprite}
      alt=""
      className="max-h-full max-w-full object-contain drop-shadow-[8px_10px_0_rgba(0,0,0,0.35)] [image-rendering:pixelated]"
      draggable={false}
    />
  </div>
);

const StatusPanel = ({ combatant, align = 'left' }: { combatant: Combatant; align?: 'left' | 'right' }) => (
  <div className={cn('w-72 border-4 border-[#b88b45] bg-[#151515] p-3 shadow-[6px_6px_0_rgba(0,0,0,0.45)] sm:w-96', align === 'right' && 'ml-auto')}>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 text-team-cream">
      <span className="break-words text-[15px] leading-snug sm:text-[18px]">{combatant.name}</span>
      <span className="shrink-0 text-[14px] leading-snug text-amber-300 sm:text-[16px]">Lv. {combatant.level}</span>
    </div>
    <div className="mt-3 flex items-center gap-3">
      <span className="text-[18px] text-amber-300 sm:text-[22px]">HP</span>
      <div className="h-5 flex-1 border-2 border-[#8f6b32] bg-stone-950 p-0.5">
        <div
          className={cn('h-full transition-all', combatant.hp > combatant.maxHp * 0.35 ? 'bg-emerald-500' : 'bg-red-500')}
          style={{ width: hpPercent(combatant) }}
        />
      </div>
    </div>
    <div className="mt-2 text-right text-[14px] leading-snug text-team-cream sm:text-[16px]">
      {combatant.hp} / {combatant.maxHp}
    </div>
  </div>
);

const TeamStrip = ({ team, activeIndex }: { team: Combatant[]; activeIndex: number }) => (
  <div className="grid gap-2">
    {team.map((member, index) => (
      <div
        key={member.id}
        className={cn(
          'border border-team-gold/20 bg-team-black/50 px-3 py-2',
          index === activeIndex && 'border-amber-300 bg-amber-300/10',
          !isStanding(member) && 'opacity-45',
        )}
      >
        <div className="text-[10px] leading-relaxed text-team-cream">{member.name}</div>
        <div className="mt-2 h-1.5 bg-stone-950">
          <div className="h-full bg-emerald-500" style={{ width: hpPercent(member) }} />
        </div>
      </div>
    ))}
  </div>
);

const ChampionStats = ({ combatant }: { combatant: Combatant }) => {
  const stats = [
    { label: 'Attack', value: getEffectiveStat(combatant, 'offense'), mod: combatant.mods.offense },
    { label: 'Defense', value: getEffectiveStat(combatant, 'defense'), mod: combatant.mods.defense },
    { label: 'Speed', value: getEffectiveStat(combatant, 'speed'), mod: combatant.mods.speed },
    { label: 'HP', value: `${combatant.hp}/${combatant.maxHp}`, mod: 0 },
  ];

  return (
    <div className="vintage-card p-5">
      <h2 className="mb-4 text-2xl leading-tight text-team-cream">{combatant.name}</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-team-gold/15 bg-team-black/30 p-3">
            <div className="text-[9px] uppercase leading-relaxed text-team-silver">{stat.label}</div>
            <div className="mt-2 text-[15px] leading-none text-team-cream">{stat.value}</div>
            {stat.mod !== 0 && (
              <div className={cn('mt-2 text-[9px] leading-relaxed', stat.mod > 0 ? 'text-emerald-400' : 'text-red-400')}>
                {stat.mod > 0 ? '+' : ''}
                {stat.mod} stage
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const finalMessageByMode: Partial<Record<BattleMode, string>> = {
  won: 'The rival dawg team is out. You win the run.',
  lost: 'All four raccoons are down. The run is over.',
  escaped: 'The raccoons retreat to the clubhouse.',
};

const BattlePage = () => {
  const [battle, setBattle] = useState<BattleState>(() => createBattle());
  const [animatingSide, setAnimatingSide] = useState<ActorSide | null>(null);
  const [animationKind, setAnimationKind] = useState<AnimationKind>('lunge');
  const [isResolving, setIsResolving] = useState(false);
  const [narration, setNarration] = useState<string[]>([]);
  const player = battle.playerTeam[battle.activePlayer];
  const enemy = battle.enemyTeam[battle.activeEnemy];
  const remainingEnemies = useMemo(() => battle.enemyTeam.filter(isStanding).length, [battle.enemyTeam]);

  const restart = () => setBattle(createBattle());

  const animateMove = async (state: BattleState, actorSide: ActorSide, selectedMove: Move) => {
    const actor = actorSide === 'player' ? state.playerTeam[state.activePlayer] : state.enemyTeam[state.activeEnemy];
    const announcement = `${actor.name} used ${selectedMove.name}.`;
    let nextState = addLog({ ...state, mode: 'command' }, [announcement]);

    setNarration([announcement]);
    setBattle(nextState);
    await pause(250);
    setAnimationKind(selectedMove.target === 'self' ? 'pulse' : 'lunge');
    setAnimatingSide(actorSide);
    await pause(920);
    setAnimatingSide(null);
    await pause(180);

    const result = applyMoveToBattle(nextState, actorSide, selectedMove);
    nextState = addLog({ ...result.state, mode: 'command' }, result.messages);
    setNarration([announcement, ...result.messages]);
    setBattle(nextState);
    await pause(760);

    return { ...result, state: nextState };
  };

  const handlePlayerMove = async (selectedMove: Move) => {
    if (isResolving) return;

    setIsResolving(true);

    try {
      let current = { ...battle, mode: 'command' as BattleMode };
      const currentPlayer = current.playerTeam[current.activePlayer];
      const currentEnemy = current.enemyTeam[current.activeEnemy];
      const playerSpeed = getEffectiveStat(currentPlayer, 'speed') + roll(-2, 2);
      const enemySpeed = getEffectiveStat(currentEnemy, 'speed') + roll(-2, 2);
      const enemyMove = chooseEnemyMove(currentEnemy, currentPlayer);
      const turnOrder: Array<{ side: ActorSide; move: Move }> =
        enemySpeed > playerSpeed
          ? [
              { side: 'enemy', move: enemyMove },
              { side: 'player', move: selectedMove },
            ]
          : [
              { side: 'player', move: selectedMove },
              { side: 'enemy', move: enemyMove },
            ];

      for (let index = 0; index < turnOrder.length; index += 1) {
        const action = turnOrder[index];
        const result = await animateMove(current, action.side, action.move);
        current = result.state;

        if (result.targetDown || index === turnOrder.length - 1) {
          current = finishTurn(result.state, []);
          setBattle(current);
          await pause(650);
          break;
        }
      }
    } finally {
      setAnimatingSide(null);
      setNarration([]);
      setIsResolving(false);
    }
  };

  const animatePotion = async (state: BattleState, item: keyof Inventory) => {
    const player = state.playerTeam[state.activePlayer];
    const itemName = item === 'potion' ? 'Potion' : 'Super Potion';
    const announcement = `${player.name} used ${itemName}.`;
    let nextState = addLog({ ...state, mode: 'command' }, [announcement]);

    setNarration([announcement]);
    setBattle(nextState);
    await pause(250);
    setAnimationKind('pulse');
    setAnimatingSide('player');
    await pause(920);
    setAnimatingSide(null);
    await pause(180);

    const result = applyPotionToBattle(nextState, item);
    nextState = addLog({ ...result.state, mode: 'command' }, result.messages);
    setNarration([announcement, ...result.messages]);
    setBattle(nextState);
    await pause(760);

    return { ...result, state: nextState };
  };

  const handlePotion = async (item: keyof Inventory) => {
    if (isResolving) return;

    if (battle.inventory[item] <= 0) {
      setBattle((state) => addLog({ ...state, mode: 'command' }, ['No potions left.']));
      return;
    }

    setIsResolving(true);

    try {
      const potionResult = await animatePotion({ ...battle, mode: 'command' }, item);
      const current = potionResult.state;

      if (isStanding(current.enemyTeam[current.activeEnemy])) {
        const enemy = current.enemyTeam[current.activeEnemy];
        const currentPlayer = current.playerTeam[current.activePlayer];
        const enemyMove = chooseEnemyMove(enemy, currentPlayer);
        const enemyResult = await animateMove(current, 'enemy', enemyMove);
        const finished = finishTurn(enemyResult.state, []);
        setBattle(finished);
        await pause(650);
      } else {
        const finished = finishTurn(current, []);
        setBattle(finished);
        await pause(650);
      }
    } finally {
      setAnimatingSide(null);
      setNarration([]);
      setIsResolving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Raccoon Renaissance | Tavistock Trash Pandas</title>
        <meta name="description" content="A quick Raccoon Renaissance battle game for the Tavistock Trash Pandas." />
      </Helmet>

      <main className="battle-pixel min-h-screen bg-team-black">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl text-team-cream sm:text-4xl">Raccoon Renaissance</h1>
            </div>
            <Button className="vintage-btn-outline w-fit" onClick={restart}>
              New Run
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-hidden border-4 border-[#b88b45] bg-[#161512] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
              <div
                className="relative min-h-[520px] overflow-hidden bg-cover bg-center p-4 sm:min-h-[650px] sm:p-6 [image-rendering:pixelated]"
                style={{ backgroundImage: "url('/images/battle/backgrounds/forest-path.png')" }}
              >
                <div className="relative z-10 h-[488px] sm:h-[602px]">
                  <StatusPanel combatant={enemy} />

                  <div className="absolute left-[57%] top-[37%] -translate-x-1/2 -translate-y-1/2 sm:left-[74%] sm:top-[42%]">
                    <Sprite combatant={enemy} side="enemy" isAnimating={animatingSide === 'enemy'} animationKind={animationKind} />
                  </div>

                  <div className="absolute left-[27%] top-[69%] -translate-x-1/2 -translate-y-1/2 sm:left-[27%] sm:top-[73%]">
                    <Sprite combatant={player} side="player" isAnimating={animatingSide === 'player'} animationKind={animationKind} />
                  </div>

                  <div className="absolute bottom-0 right-0">
                    <StatusPanel combatant={player} align="right" />
                  </div>
                </div>
              </div>

              <div className="min-h-72 border-t-4 border-[#b88b45] bg-[#eee7d8] p-4 text-[#171411]">
                {isResolving && (
                  <div className="flex min-h-64 flex-col justify-center space-y-5 bg-[#f8f4eb] p-6 text-[13px] leading-relaxed text-[#171411] shadow-[inset_0_0_0_2px_rgba(23,20,17,0.12)] sm:text-[16px]">
                    {narration.map((entry, index) => (
                      <p key={`${entry}-${index}`}>{entry}</p>
                    ))}
                  </div>
                )}

                {!isResolving && battle.mode === 'command' && (
                  <div className="grid min-h-64 content-center gap-3 sm:grid-cols-2">
                      <Button className={menuButtonClass} disabled={isResolving} onClick={() => setBattle((state) => ({ ...state, mode: 'fight' }))}>
                        Fight
                      </Button>
                      <Button className={menuButtonClass} disabled={isResolving} onClick={() => setBattle((state) => ({ ...state, mode: 'item' }))}>
                        Item
                      </Button>
                      <Button className={menuButtonClass} disabled={isResolving} onClick={() => setBattle((state) => ({ ...state, mode: 'switch' }))}>
                        Switch
                      </Button>
                      <Button className={menuButtonClass} disabled={isResolving} onClick={() => setBattle((state) => addLog({ ...state, mode: 'escaped' }, ['The raccoons retreat to the clubhouse.']))}>
                        Run
                      </Button>
                  </div>
                )}

                {!isResolving && battle.mode === 'fight' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                      {player.moves.map((knownMove) => (
                        <div key={knownMove.id} className="grid grid-cols-[1fr_56px] gap-3">
                          <Button
                            className={menuButtonClass}
                            variant="secondary"
                            disabled={isResolving}
                            onClick={() => handlePlayerMove(knownMove)}
                          >
                            {knownMove.name}
                          </Button>
                          <MoveInfoButton selectedMove={knownMove} />
                        </div>
                      ))}
                      <Button className={cn(menuButtonClass, 'sm:col-span-2')} onClick={() => setBattle((state) => ({ ...state, mode: 'command' }))}>
                        Back
                      </Button>
                  </div>
                )}

                {!isResolving && battle.mode === 'item' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid grid-cols-[1fr_56px] gap-3">
                        <Button className={menuButtonClass} onClick={() => handlePotion('potion')}>
                          Potion <span>x{battle.inventory.potion}</span>
                        </Button>
                        <ItemInfoButton name="Potion" healAmount={25} description="A small bottle for quick recovery." />
                      </div>
                      <div className="grid grid-cols-[1fr_56px] gap-3">
                        <Button className={menuButtonClass} onClick={() => handlePotion('superPotion')}>
                          Super Potion <span>x{battle.inventory.superPotion}</span>
                        </Button>
                        <ItemInfoButton name="Super Potion" healAmount={50} description="A stronger heal for rough turns." />
                      </div>
                      <Button className={cn(menuButtonClass, 'sm:col-span-2')} onClick={() => setBattle((state) => ({ ...state, mode: 'command' }))}>
                        Back
                      </Button>
                  </div>
                )}

                {!isResolving && battle.mode === 'switch' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                      {battle.playerTeam.map((member, index) => (
                        <Button
                          key={member.id}
                          className={menuButtonClass}
                          disabled={!isStanding(member) || index === battle.activePlayer}
                          onClick={() => setBattle((state) => switchToRaccoon(state, index))}
                        >
                          {member.name} <span>{member.hp} / {member.maxHp}</span>
                        </Button>
                      ))}
                      {isStanding(player) && (
                        <Button className={cn(menuButtonClass, 'sm:col-span-2')} onClick={() => setBattle((state) => ({ ...state, mode: 'command' }))}>
                          Back
                        </Button>
                      )}
                  </div>
                )}

                {!isResolving && (battle.mode === 'won' || battle.mode === 'lost' || battle.mode === 'escaped') && (
                  <div className="flex min-h-64 flex-col items-start justify-center gap-5">
                      <h2 className="text-3xl leading-tight text-[#171411] sm:text-4xl">
                        {battle.mode === 'won' ? 'Run Won' : battle.mode === 'lost' ? 'Run Lost' : 'Run Ended'}
                      </h2>
                      <div className="max-w-3xl space-y-3 text-[12px] leading-relaxed text-[#171411] sm:text-[15px]">
                        <p>{finalMessageByMode[battle.mode]}</p>
                      </div>
                      <Button className={menuButtonClass} onClick={restart}>
                        Play Again
                      </Button>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <ChampionStats combatant={player} />

              <div className="vintage-card p-5">
                <h2 className="mb-3 text-2xl leading-tight text-team-cream">Your Team</h2>
                <TeamStrip team={battle.playerTeam} activeIndex={battle.activePlayer} />
              </div>

              <div className="vintage-card p-5">
                <h2 className="mb-3 text-2xl leading-tight text-team-cream">Dawgs</h2>
                <TeamStrip team={battle.enemyTeam} activeIndex={battle.activeEnemy} />
                <p className="mt-4 text-[10px] leading-relaxed text-team-silver">{remainingEnemies} dawgs still standing.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
};

export default BattlePage;

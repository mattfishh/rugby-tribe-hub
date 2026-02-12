import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface PlayingCard {
  suit: Suit;
  rank: Rank;
  value: number;
  hidden?: boolean;
}

// Game states
type GameState = 'betting' | 'playing' | 'dealerTurn' | 'gameOver';

const STARTING_BANKROLL = 1000;
const BET_INCREMENT = 50;
const CHIP_VALUES = [25, 100, 500];

// Update the Prize interface to include a special type for the slider
interface Prize {
  id: string;
  name: string;
  description: string;
  cost: number;
  image?: string;
  type?: 'slider';
}

// Update the PRIZES array with the new prizes
const PRIZES: Prize[] = [
  {
    id: 'pbr',
    name: 'Warm PBR',
    description: 'Nothing says "rugby" like a lukewarm Pabst Blue Ribbon. Buy in bulk for team events.',
    cost: 2,
    image: '/images/logos/tavistock-logo.jpg',
    type: 'slider'
  },
  {
    id: 'speeding-ticket',
    name: 'Connecticut Speeding Ticket',
    description: 'Nate thanks you for your donation. He promises to never visit Connecticut again.',
    cost: 350,
    image: '/images/logos/tavistock-logo.jpg'
  },
  {
    id: 'raccoon',
    name: 'A Live Raccoon',
    description: 'Adopt your very own trash panda. Rabies status unknown. No refunds.',
    cost: 6969,
    image: '/images/logos/tavistock-logo.jpg'
  }
];

// Add this interface for the popup
interface PrizePopup {
  show: boolean;
  prize: Prize | null;
  quantity?: number;
}

const CasinoPage = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>('betting');
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([]);
  const [bankroll, setBankroll] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [kidneysLeft, setKidneysLeft] = useState(2);
  const [pbrCount, setPbrCount] = useState(1);

  // Add these state variables to the component
  const [prizePopup, setPrizePopup] = useState<PrizePopup>({ show: false, prize: null });
  const confettiRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    // Load bankroll from localStorage or use default
    const savedBankroll = localStorage.getItem('raccjack-bankroll');
    setBankroll(savedBankroll ? parseInt(savedBankroll) : STARTING_BANKROLL);
    
    // Load kidneys left from localStorage or use default
    const savedKidneys = localStorage.getItem('raccjack-kidneys');
    setKidneysLeft(savedKidneys ? parseInt(savedKidneys) : 2);
    
    // Initialize a new deck
    initializeDeck();
  }, []);

  // Save bankroll to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('raccjack-bankroll', bankroll.toString());
  }, [bankroll]);

  // Save kidneys left to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('raccjack-kidneys', kidneysLeft.toString());
  }, [kidneysLeft]);

  // Create and shuffle a new deck
  const initializeDeck = () => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const newDeck: PlayingCard[] = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        let value = 0;
        
        if (rank === 'A') {
          value = 11; // Aces are 11 by default, will handle soft hands later
        } else if (['J', 'Q', 'K'].includes(rank)) {
          value = 10;
        } else {
          value = parseInt(rank);
        }
        
        newDeck.push({ suit, rank, value });
      }
    }
    
    // Shuffle the deck
    const shuffledDeck = [...newDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
  };

  // Deal a card from the deck - fixed to deal sequentially
  const dealCard = (hidden = false): PlayingCard => {
    if (deck.length === 0) {
      initializeDeck();
      return dealCard(hidden);
    }
    
    // Take the first card from the deck and remove it
    const [card, ...remainingDeck] = deck;
    setDeck(remainingDeck);
    
    // Return a new card object with the hidden property
    return { ...card, hidden };
  };

  // Start a new game - improved card dealing
  const startGame = () => {
    if (currentBet <= 0) {
      setMessage('Please place a bet first!');
      return;
    }

    if (currentBet > bankroll) {
      setMessage('Not enough funds!');
      return;
    }

    // DEDUCT THE BET FROM BANKROLL
    setBankroll(prev => prev - currentBet);

    // Reset hands
    setPlayerHand([]);
    setDealerHand([]);
    setMessage('');
    setResult('');

    // Check if we need a new deck (less than 20 cards left)
    if (deck.length < 20) {
      initializeDeck();
    }

    // Deal initial cards in proper blackjack order:
    // We'll deal all cards at once to ensure they're unique
    const [firstCard, secondCard, thirdCard, fourthCard, ...remainingDeck] = deck;

    const pCard1 = { ...firstCard };
    const dCard1 = { ...secondCard };
    const pCard2 = { ...thirdCard };
    const dCard2 = { ...fourthCard, hidden: true };

    // Update the deck
    setDeck(remainingDeck);

    // Set the hands
    const newPlayerHand = [pCard1, pCard2];
    const newDealerHand = [dCard1, dCard2];

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');

    // Check for natural blackjack
    setTimeout(() => {
      const playerScore = calculateHandValue(newPlayerHand);
      const dealerScore = calculateHandValue(newDealerHand);

      // Check for natural blackjack (21 with first two cards)
      if (playerScore === 21) {
        // Reveal dealer's hidden card
        const updatedDealerHand = newDealerHand.map(card => ({ ...card, hidden: false }));
        setDealerHand(updatedDealerHand);

        if (dealerScore === 21) {
          // Both have blackjack - it's a push (return bet)
          setMessage("Both have Blackjack! It's a push.");
          setResult('push');
          setBankroll(prev => prev + currentBet);
          setGameState('gameOver');
        } else {
          // Player has blackjack, dealer doesn't - player wins 3:2
          const blackjackPayout = Math.floor(currentBet * 2.5);
          setMessage(`Blackjack! You win $${Math.floor(currentBet * 1.5)}!`);
          setResult('win');
          setBankroll(prev => prev + blackjackPayout);
          setGameState('gameOver');
        }
      }
    }, 500);
  };

  // Player hits - improved to deal from deck
  const hit = () => {
    const newCard = dealCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const newScore = calculateHandValue(newHand);

    if (newScore > 21) {
      // Player busts
      setMessage(`Bust! You went over with ${newScore}.`);
      setResult('lose');
      setGameState('gameOver');

      // Reveal dealer's hidden card
      const revealedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }));
      setDealerHand(revealedDealerHand);
    } else if (newScore === 21) {
      // Player has 21, automatically stand with the new score
      setMessage('You have 21! Standing automatically.');
      setTimeout(() => playDealerHand(newScore), 500);
    }
  };

  // Play dealer's hand - accepts player score to avoid state issues
  const playDealerHand = (playerScore: number, betAmount: number = currentBet) => {
    // Reveal dealer's hidden card first
    const revealedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }));
    setDealerHand(revealedDealerHand);

    // Dealer's turn
    let currentDealerHand = [...revealedDealerHand];
    let dealerScore = calculateHandValue(currentDealerHand);

    // Dealer must draw until they have at least 17
    const dealerPlay = () => {
      if (dealerScore < 17) {
        const newCard = dealCard();
        currentDealerHand = [...currentDealerHand, newCard];
        setDealerHand(currentDealerHand);
        dealerScore = calculateHandValue(currentDealerHand);

        setTimeout(() => {
          dealerPlay();
        }, 700);
      } else {
        // Determine the winner using the passed player score
        if (dealerScore > 21) {
          // Dealer busts - player wins (get bet back + winnings)
          setMessage(`Dealer busts with ${dealerScore}! You win $${betAmount}!`);
          setResult('win');
          setBankroll(prev => prev + betAmount * 2);
        } else if (playerScore > dealerScore) {
          // Player wins (get bet back + winnings)
          setMessage(`You win with ${playerScore} vs dealer's ${dealerScore}! +$${betAmount}`);
          setResult('win');
          setBankroll(prev => prev + betAmount * 2);
        } else if (dealerScore > playerScore) {
          // Dealer wins (bet already deducted, nothing to do)
          setMessage(`Dealer wins with ${dealerScore} vs your ${playerScore}.`);
          setResult('lose');
        } else {
          // Push - tie (return bet only)
          setMessage(`Push! Both have ${playerScore}.`);
          setResult('push');
          setBankroll(prev => prev + betAmount);
        }

        setGameState('gameOver');
      }
    };

    setTimeout(() => {
      dealerPlay();
    }, 700);
  };

  // Player stands - use the playDealerHand function
  const stand = () => {
    const playerScore = calculateHandValue(playerHand);
    playDealerHand(playerScore);
  };

  // Reveal dealer's hidden card - improved to create new objects
  const revealDealerCard = () => {
    setDealerHand(prev => 
      prev.map(card => ({ ...card, hidden: false }))
    );
  };

  // Calculate the value of a hand
  const calculateHandValue = (hand: PlayingCard[], countHidden = true): number => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      if (card.hidden && !countHidden) continue;
      
      if (card.rank === 'A') {
        aces += 1;
      }
      value += card.value;
    }
    
    // Handle aces (can be 1 or 11)
    while (value > 21 && aces > 0) {
      value -= 10; // Convert an ace from 11 to 1
      aces -= 1;
    }
    
    return value;
  };

  // Place a bet
  const placeBet = (amount: number) => {
    if (gameState !== 'betting') return;

    const newBet = currentBet + amount;
    if (newBet > bankroll) {
      setMessage('Not enough funds!');
      return;
    }

    setCurrentBet(newBet);
    setMessage('');
  };

  // Reset bet
  const resetBet = () => {
    if (gameState !== 'betting') return;
    setCurrentBet(0);
  };

  // Start a new hand
  const newHand = () => {
    setGameState('betting');
    setCurrentBet(0);
    setMessage('');
    setResult('');
  };

  // Update the sellKidney function to track kidneys
  const sellKidney = () => {
    if (kidneysLeft > 0) {
      setBankroll(prev => prev + STARTING_BANKROLL);
      setKidneysLeft(prev => prev - 1);
      setMessage(`Sold a kidney for +$${STARTING_BANKROLL}! ${kidneysLeft - 1} kidney${kidneysLeft - 1 === 1 ? '' : 's'} left.`);
    } else {
      setMessage('You have no kidneys left to sell!');
    }
  };

  // Add a reset game function
  const resetGame = () => {
    setBankroll(STARTING_BANKROLL);
    setKidneysLeft(2);
    setCurrentBet(0);
    setGameState('betting');
    setMessage('Game reset! Bankroll set to $1000 and kidneys restored.');
    setPlayerHand([]);
    setDealerHand([]);
    setResult('');
    initializeDeck();
  };

  // Render a card - balanced size for better screen fit and readability
  const renderCard = (card: PlayingCard) => {
    if (card.hidden) {
      return (
        <div className="w-24 h-32 bg-team-gray border-2 border-team-gold/30 flex items-center justify-center shadow-md rounded-sm">
          <div className="w-20 h-28 bg-team-darkgray flex items-center justify-center border border-team-gold/10">
            <img
              src="/images/logos/tavistock-logo.jpg"
              alt="Card Back"
              className="w-12 h-12 object-contain opacity-50"
            />
          </div>
        </div>
      );
    }

    const suitSymbol = {
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣',
      'spades': '♠'
    }[card.suit];

    const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-800' : 'text-team-black';

    return (
      <div className="w-24 h-32 bg-team-cream border-2 border-team-gold/40 flex flex-col items-center justify-between p-2 shadow-md rounded-sm">
        <div className={`text-left w-full ${suitColor}`}>
          <div className="text-base font-display font-bold leading-none">{card.rank}</div>
          <div className="text-lg leading-none">{suitSymbol}</div>
        </div>
        <div className={`text-3xl ${suitColor}`}>{suitSymbol}</div>
        <div className={`text-right w-full ${suitColor} rotate-180`}>
          <div className="text-base font-display font-bold leading-none">{card.rank}</div>
          <div className="text-lg leading-none">{suitSymbol}</div>
        </div>
      </div>
    );
  };

  // Render dealer's score - only count visible cards
  const getDealerVisibleScore = () => {
    const visibleCards = dealerHand.filter(card => !card.hidden);
    return calculateHandValue(visibleCards);
  };

  // Add a new function for double down
  const doubleDown = () => {
    if (bankroll < currentBet) {
      setMessage('Not enough funds to double down!');
      return;
    }

    // Deduct the additional bet amount (original bet was already deducted)
    setBankroll(prev => prev - currentBet);

    // Double the bet for payout calculations
    const doubledBet = currentBet * 2;
    setCurrentBet(doubledBet);

    // Take one card and stand
    const [newCard, ...remainingDeck] = deck;
    setDeck(remainingDeck);

    const newHand = [...playerHand, { ...newCard }];
    setPlayerHand(newHand);

    const handValue = calculateHandValue(newHand);

    if (handValue > 21) {
      // Player busts
      revealDealerCard();
      setResult('lose');
      setMessage(`Bust with ${handValue}! You lose.`);
      setGameState('gameOver');
    } else {
      // Automatically play dealer's hand with the doubled bet
      setTimeout(() => playDealerHand(handValue, doubledBet), 500);
    }
  };

  // Add this simple confetti function
  const triggerConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-20px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.position = 'fixed';
      confetti.style.zIndex = '1000';
      confetti.style.borderRadius = '50%';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(confetti);
      
      // Animate falling
      setTimeout(() => {
        confetti.style.transition = 'top 3s, left 3s, opacity 3s';
        confetti.style.top = '100vh';
        confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() * 40 - 20)) + 'vw';
        confetti.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          document.body.removeChild(confetti);
        }, 3000);
      }, 10);
    }
  };

  // Update the redeemPrize function to use our new confetti function
  const redeemPrize = (prize: Prize) => {
    const totalCost = prize.id === 'pbr' ? prize.cost * pbrCount : prize.cost;
    
    if (bankroll >= totalCost) {
      setBankroll(prev => prev - totalCost);
      
      // Show success message
      if (prize.id === 'pbr') {
        setMessage(`Congratulations! You've redeemed ${pbrCount} warm PBR${pbrCount > 1 ? 's' : ''}!`);
      } else {
        setMessage(`Congratulations! You've redeemed: ${prize.name}`);
      }
      
      // Show popup and trigger confetti
      setPrizePopup({ 
        show: true, 
        prize, 
        quantity: prize.id === 'pbr' ? pbrCount : undefined 
      });
      
      // Trigger confetti
      triggerConfetti();
    } else {
      setMessage(`Not enough funds to redeem ${prize.name}. Sell more kidneys!`);
    }
  };

  // Add this function to close the popup
  const closePopup = () => {
    setPrizePopup({ show: false, prize: null });
  };

  return (
    <>
      <Helmet>
        <title>Casino | Tavistock Trash Pandas</title>
        <meta name="description" content="Play games and earn rewards with the Tavistock Trash Pandas Rugby team." />
      </Helmet>
      
      <div className="page-container">
        <h1 className="section-title">RaccJack</h1>
        
        {/* Game rules as collapsible accordion - compact */}
        <div className="mb-4">
          <button
            onClick={() => setRulesExpanded(!rulesExpanded)}
            className="w-full bg-team-gray/10 border border-team-gold/20 p-2 flex justify-between items-center"
          >
            <h2 className="text-xs font-headline tracking-[0.2em] uppercase text-team-gold">How to Play</h2>
            {rulesExpanded ? (
              <ChevronUp className="h-4 w-4 text-team-silver" />
            ) : (
              <ChevronDown className="h-4 w-4 text-team-silver" />
            )}
          </button>

          {rulesExpanded && (
            <Card className="bg-team-gray/10 border-t-0 border-team-gold/20 rounded-t-none">
              <CardContent className="p-4">
                <div className="space-y-2 text-team-silver font-body text-sm">
                  <p className="text-xs italic">Standard blackjack with kidney sales for extra cash.</p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Get closer to 21 than the dealer without going over</li>
                    <li>Face cards = 10, Aces = 11 or 1</li>
                    <li>Blackjack (21 with 2 cards) pays 3:2</li>
                    <li>Dealer must hit on 16 or less, stand on 17+</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Game container - compact layout */}
        <div className="vintage-card p-4 mb-6">
          {/* Top info bar - bankroll and current bet in one row */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-display font-bold text-team-cream">
              Bankroll: <span className="text-team-gold">${bankroll}</span>
            </div>
            <div className="text-lg font-display font-bold text-team-cream">
              Bet: <span className="text-team-gold">${currentBet}</span>
            </div>
          </div>

          {/* Message area - compact */}
          <div className="h-10 mb-3">
            {message && (
              <div className={`text-center py-2 rounded-lg font-display font-bold text-sm ${
                result === 'win' || result === 'blackjack'
                  ? 'bg-green-900/30 text-green-400'
                  : result === 'lose' || result === 'bust'
                    ? 'bg-red-900/30 text-red-400'
                    : 'bg-team-gray/30 text-team-silver'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Playing area - compact two-column layout */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Dealer section */}
            <div className="min-h-[160px]">
              <h2 className="text-base font-display font-bold text-team-silver mb-2 text-center">
                Dealer {gameState !== 'betting' && (gameState === 'gameOver' || gameState === 'dealerTurn'
                  ? `(${calculateHandValue(dealerHand)})`
                  : `(${getDealerVisibleScore()})`)}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center min-h-[130px] items-center">
                {gameState !== 'betting' ? (
                  dealerHand.map((card, index) => (
                    <div key={`dealer-${index}`} className="transform transition-transform hover:translate-y-[-3px]">
                      {renderCard(card)}
                    </div>
                  ))
                ) : (
                  <div className="text-team-silver opacity-50 text-sm">Dealer cards</div>
                )}
              </div>
            </div>

            {/* Player section */}
            <div className="min-h-[160px]">
              <h2 className="text-base font-display font-bold text-team-silver mb-2 text-center">
                You {gameState !== 'betting' && `(${calculateHandValue(playerHand)})`}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center min-h-[130px] items-center">
                {gameState !== 'betting' ? (
                  playerHand.map((card, index) => (
                    <div key={`player-${index}`} className="transform transition-transform hover:translate-y-[-3px]">
                      {renderCard(card)}
                    </div>
                  ))
                ) : (
                  <div className="text-team-silver opacity-50 text-sm">Your cards</div>
                )}
              </div>
            </div>
          </div>

          {/* Game controls - compact */}
          <div className="space-y-3">
            {/* Betting chips - only shown in betting state */}
            <div className={`flex justify-center gap-3 transition-opacity duration-300 ${gameState === 'betting' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {CHIP_VALUES.map(value => (
                <div key={value} className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => placeBet(value)}
                    disabled={currentBet + value > bankroll || gameState !== 'betting'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-headline text-xs tracking-wider
                      transform transition-all hover:scale-110 active:scale-95 border-2
                      ${value === 25 ? 'bg-team-gray border-team-gold/40 text-team-cream' :
                        value === 100 ? 'bg-team-gray border-team-gold/60 text-team-gold' :
                        'bg-team-gray border-team-gold text-team-gold'}
                      ${currentBet + value > bankroll ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                    `}
                    title={`Add $${value} to bet`}
                  >
                    +${value}
                  </button>
                  {currentBet >= value && (
                    <button
                      onClick={() => placeBet(-value)}
                      disabled={gameState !== 'betting'}
                      className="text-xs text-team-silver/60 hover:text-team-silver transition-colors"
                      title={`Remove $${value} from bet`}
                    >
                      -${value}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Game action buttons */}
            <div className="flex justify-center gap-2 flex-wrap">
              {gameState === 'betting' && (
                <>
                  <Button
                    onClick={resetBet}
                    className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-gray border border-team-gold/30 text-team-silver hover:text-team-cream hover:border-team-gold/60 h-8 px-3"
                    disabled={currentBet <= 0}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentBet(bankroll);
                      setMessage('Going all in!');
                    }}
                    className="font-headline text-[10px] tracking-[0.1em] uppercase bg-red-900/30 border border-red-700/40 text-red-400 hover:border-red-700/60 h-8 px-3"
                    disabled={currentBet === bankroll || bankroll === 0}
                  >
                    All In
                  </Button>
                  <Button
                    onClick={startGame}
                    className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-cream text-team-black border border-team-cream hover:bg-team-gold h-8 px-4"
                    disabled={currentBet <= 0}
                  >
                    Deal
                  </Button>
                  {kidneysLeft > 0 ? (
                    <Button
                      onClick={sellKidney}
                      className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-gray border border-red-900/40 text-red-400 hover:border-red-700/60 h-8 px-3"
                    >
                      Sell Kidney
                    </Button>
                  ) : (
                    <Button
                      onClick={resetGame}
                      className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-gray border border-team-gold/30 text-team-gold hover:border-team-gold/60 h-8 px-3"
                    >
                      Reset Game
                    </Button>
                  )}
                </>
              )}

              {gameState === 'playing' && (
                <>
                  <Button
                    onClick={hit}
                    className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-cream text-team-black hover:bg-team-gold h-8 px-4"
                  >
                    Hit
                  </Button>
                  <Button
                    onClick={stand}
                    className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-gray text-team-cream border border-team-gold/30 hover:border-team-gold/60 h-8 px-4"
                  >
                    Stand
                  </Button>
                  {playerHand.length === 2 && (
                    <Button
                      onClick={doubleDown}
                      className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-gold/20 text-team-gold border border-team-gold/40 hover:bg-team-gold/30 disabled:opacity-50 disabled:cursor-not-allowed h-8 px-3"
                      disabled={bankroll < currentBet}
                      title={bankroll < currentBet ? 'Not enough funds to double down' : 'Double your bet and take one final card'}
                    >
                      Double
                    </Button>
                  )}
                </>
              )}

              {gameState === 'gameOver' && (
                <Button
                  onClick={newHand}
                  className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-cream text-team-black hover:bg-team-gold h-8 px-4"
                >
                  New Hand
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Prizes Section - compact */}
        <div className="mb-4">
          <h2 className="text-xs font-headline tracking-[0.2em] uppercase text-team-gold mb-3">Redeem Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRIZES.map(prize => (
              <div key={prize.id} className="vintage-card p-3">
                  <div className="flex flex-col h-full">
                    <div className="mb-2 flex justify-center">
                      {prize.image && (
                        <img
                          src={prize.image}
                          alt={prize.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="text-base font-display font-bold text-team-cream mb-1">
                      {prize.id === 'pbr' ? (
                        <span>
                          <span className="text-lg text-team-gold">{pbrCount}</span> Warm PBR{pbrCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        prize.name
                      )}
                    </h3>
                    <p className="text-team-silver mb-2 flex-grow font-body italic text-xs">{prize.description}</p>

                    {prize.type === 'slider' ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="1000"
                            value={pbrCount}
                            onChange={(e) => setPbrCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-team-gray appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-display font-bold text-team-gold">${prize.cost * pbrCount}</span>
                          <Button
                            onClick={() => redeemPrize(prize)}
                            className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-cream text-team-black hover:bg-team-gold h-7 px-2"
                            disabled={bankroll < prize.cost * pbrCount}
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-display font-bold text-team-gold">${prize.cost}</span>
                        <Button
                          onClick={() => redeemPrize(prize)}
                          className="font-headline text-[10px] tracking-[0.1em] uppercase bg-team-cream text-team-black hover:bg-team-gold h-7 px-2"
                          disabled={bankroll < prize.cost}
                        >
                          Redeem
                        </Button>
                      </div>
                    )}
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Prize redemption popup */}
      {prizePopup.show && prizePopup.prize && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            ref={confettiRef}
            className="vintage-card p-8 max-w-md w-full relative"
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-team-silver hover:text-team-cream"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <h3 className="text-sm font-headline tracking-[0.3em] uppercase text-team-gold mb-4">
                Prize Redeemed!
              </h3>
              
              <div className="mb-6 flex justify-center">
                {prizePopup.prize.image && (
                  <img 
                    src={prizePopup.prize.image} 
                    alt={prizePopup.prize.name} 
                    className="w-32 h-32 object-contain"
                  />
                )}
              </div>
              
              <p className="text-xl font-display font-bold text-team-cream mb-2">
                {prizePopup.prize.id === 'pbr' && prizePopup.quantity
                  ? `${prizePopup.quantity} Warm PBR${prizePopup.quantity > 1 ? 's' : ''}`
                  : prizePopup.prize.name}
              </p>

              <p className="text-team-silver mb-6 font-body italic">
                {prizePopup.prize.description}
              </p>

              <Button
                onClick={closePopup}
                className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black hover:bg-team-gold"
              >
                Splendid!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CasinoPage;

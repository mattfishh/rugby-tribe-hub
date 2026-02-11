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
      const dealerVisibleScore = calculateHandValue([dCard1]); // Score of visible card only
      
      // Check for natural blackjack (21 with first two cards)
      if (playerScore === 21) {
        // Reveal dealer's hidden card
        const updatedDealerHand = newDealerHand.map(card => ({ ...card, hidden: false }));
        setDealerHand(updatedDealerHand);
        
        if (dealerScore === 21) {
          // Both have blackjack - it's a push
          setMessage("Both have Blackjack! It's a push.");
          setResult('push');
          setBankroll(prev => prev + currentBet); // Return the bet
          setGameState('gameOver');
        } else {
          // Player has blackjack, dealer doesn't - player wins 3:2
          const blackjackPayout = currentBet * 1.5;
          setMessage(`Blackjack! You win ${blackjackPayout.toFixed(2)}!`);
          setResult('win');
          setBankroll(prev => prev + currentBet + blackjackPayout);
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
      // Player has 21, automatically stand
      // We need to ensure the state is updated before standing
      setPlayerHand(newHand);
      
      // Use a callback to ensure the state is updated before standing
      setTimeout(() => {
        // Call stand with the updated hand
        const updatedPlayerHand = newHand;
        const revealedDealerHand = dealerHand.map(card => ({ ...card, hidden: false }));
        setDealerHand(revealedDealerHand);
        
        // Dealer's turn
        let currentDealerHand = [...revealedDealerHand];
        let dealerScore = calculateHandValue(currentDealerHand);
        
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
            // Determine the winner
            const playerScore = calculateHandValue(updatedPlayerHand);
            
            if (dealerScore > 21) {
              // Dealer busts
              setMessage(`Dealer busts with ${dealerScore}! You win $${currentBet}!`);
              setResult('win');
              setBankroll(prev => prev + currentBet * 2);
            } else if (playerScore > dealerScore) {
              // Player wins
              setMessage(`You win with ${playerScore} vs dealer's ${dealerScore}! +$${currentBet}`);
              setResult('win');
              setBankroll(prev => prev + currentBet * 2);
            } else if (dealerScore > playerScore) {
              // Dealer wins
              setMessage(`Dealer wins with ${dealerScore} vs your ${playerScore}.`);
              setResult('lose');
            } else {
              // Push - tie
              setMessage(`Push! Both have ${playerScore}.`);
              setResult('push');
              setBankroll(prev => prev + currentBet);
            }
            
            setGameState('gameOver');
          }
        };
        
        setTimeout(() => {
          dealerPlay();
        }, 700);
      }, 500);
    }
  };

  // Player stands - improved dealer logic with proper card dealing
  const stand = () => {
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
        // Determine the winner
        const playerScore = calculateHandValue(playerHand);
        
        if (dealerScore > 21) {
          // Dealer busts
          setMessage(`Dealer busts with ${dealerScore}! You win $${currentBet}!`);
          setResult('win');
          setBankroll(prev => prev + currentBet * 2);
        } else if (playerScore > dealerScore) {
          // Player wins
          setMessage(`You win with ${playerScore} vs dealer's ${dealerScore}! +$${currentBet}`);
          setResult('win');
          setBankroll(prev => prev + currentBet * 2);
        } else if (dealerScore > playerScore) {
          // Dealer wins
          setMessage(`Dealer wins with ${dealerScore} vs your ${playerScore}.`);
          setResult('lose');
        } else {
          // Push - tie
          setMessage(`Push! Both have ${playerScore}.`);
          setResult('push');
          setBankroll(prev => prev + currentBet);
        }
        
        setGameState('gameOver');
      }
    };
    
    setTimeout(() => {
      dealerPlay();
    }, 700);
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
    
    const newBet = Math.max(0, currentBet + amount);
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

  // Render a card - improved styling and clarity with larger card size
  const renderCard = (card: PlayingCard) => {
    if (card.hidden) {
      return (
        <div className="w-32 h-48 bg-team-gray border-2 border-team-gold/30 flex items-center justify-center shadow-md">
          <div className="w-28 h-44 bg-team-darkgray flex items-center justify-center border border-team-gold/10">
            <img
              src="/images/logos/tavistock-logo.jpg"
              alt="Card Back"
              className="w-16 h-16 object-contain opacity-50"
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
      <div className="w-32 h-48 bg-team-cream border-2 border-team-gold/40 flex flex-col items-center justify-between p-3 shadow-md">
        <div className={`text-left w-full ${suitColor}`}>
          <div className="text-xl font-display font-bold">{card.rank}</div>
          <div className="text-2xl">{suitSymbol}</div>
        </div>
        <div className={`text-5xl ${suitColor}`}>{suitSymbol}</div>
        <div className={`text-right w-full ${suitColor} rotate-180`}>
          <div className="text-xl font-display font-bold">{card.rank}</div>
          <div className="text-2xl">{suitSymbol}</div>
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
    if (bankroll < currentBet * 2) {
      setMessage('Not enough funds to double down!');
      return;
    }
    
    // Double the bet
    setCurrentBet(prev => prev * 2);
    
    // Take one card and stand
    const [newCard, ...remainingDeck] = deck;
    setDeck(remainingDeck);
    
    const newHand = [...playerHand, { ...newCard }];
    setPlayerHand(newHand);
    
    const handValue = calculateHandValue(newHand);
    
    if (handValue > 21) {
      // Player busts
      revealDealerCard();
      setResult('bust');
      setMessage('Bust! You lose.');
      setBankroll(prev => prev - currentBet * 2);
      setGameState('gameOver');
    } else {
      // Automatically stand
      setTimeout(() => stand(), 500);
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
        
        {/* Game rules as collapsible accordion - moved above the game */}
        <div className="mb-8">
          <button
            onClick={() => setRulesExpanded(!rulesExpanded)}
            className="w-full bg-team-gray/10 border border-team-gold/20 p-4 flex justify-between items-center"
          >
            <h2 className="text-sm font-headline tracking-[0.2em] uppercase text-team-gold">How to Play RaccJack</h2>
            {rulesExpanded ? (
              <ChevronUp className="h-6 w-6 text-team-silver" />
            ) : (
              <ChevronDown className="h-6 w-6 text-team-silver" />
            )}
          </button>
          
          {rulesExpanded && (
            <Card className="bg-team-gray/10 border-t-0 border-team-gold/20 rounded-t-none">
              <CardContent className="p-6">
                <div className="space-y-3 text-team-silver font-body">
                  <p>RaccJack is just blackjack, with blackmarket organ dealing to obtain more money.</p>
                  
                  <p>If you don't know how to play blackjack, this might not be the team to support for you. But here are the rules anyways.</p>
                  
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Place your bet and click "Deal" to start.</li>
                    <li>Cards 2-10 are worth their face value.</li>
                    <li>Face cards (J, Q, K) are worth 10 points.</li>
                    <li>Aces are worth 11 points, unless that would cause you to bust, then they're worth 1 point.</li>
                    <li>If you get 21 points exactly with your first two cards (an Ace and a 10-value card), you have a "Blackjack" and win 1.5 times your bet.</li>
                    <li>Click "Hit" to take another card, or "Stand" to keep your current hand.</li>
                    <li>If you go over 21, you "bust" and lose your bet.</li>
                    <li>After you stand, the dealer reveals their hidden card and must hit until they have at least 17 points.</li>
                    <li>If the dealer busts, you win. Otherwise, the hand with the higher value wins.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Game container */}
        <div className="vintage-card p-8 mb-8">
          {/* Bankroll display - fixed position */}
          <div className="h-10 mb-6">
            <div className="text-xl font-display font-bold text-team-cream">
              Bankroll: <span className="text-team-gold">${bankroll}</span>
            </div>
          </div>
          
          {/* Message area - moved above dealer's hand */}
          <div className="h-16 mb-6">
            {message ? (
              <div className={`text-center py-3 rounded-lg font-display font-bold text-lg ${
                result === 'win' || result === 'blackjack' 
                  ? 'bg-green-900/30 text-green-400' 
                  : result === 'lose' || result === 'bust' 
                    ? 'bg-red-900/30 text-red-400' 
                    : 'bg-team-gray/30 text-team-silver'
              }`}>
                {message}
              </div>
            ) : (
              <div className="h-12">{/* Empty placeholder */}</div>
            )}
          </div>
          
          {/* Playing area with fixed heights */}
          <div className="flex flex-col mb-8">
            {/* Dealer section - fixed height */}
            <div className="min-h-[200px] w-full mb-8">
              <h2 className="text-lg font-display font-bold text-team-silver mb-2 text-center">
                Dealer's Hand {gameState !== 'betting' && (gameState === 'gameOver' || gameState === 'dealerTurn' 
                  ? `(${calculateHandValue(dealerHand)})` 
                  : `(${getDealerVisibleScore()})`)}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center min-h-[160px] items-center">
                {gameState !== 'betting' ? (
                  dealerHand.map((card, index) => (
                    <div key={`dealer-${index}`} className="transform transition-transform hover:translate-y-[-5px]">
                      {renderCard(card)}
                    </div>
                  ))
                ) : (
                  <div className="text-team-silver opacity-50">Cards will appear here</div>
                )}
              </div>
            </div>
            
            {/* Player section - fixed height */}
            <div className="min-h-[200px] w-full">
              <h2 className="text-lg font-display font-bold text-team-silver mb-2 text-center">
                Your Hand {gameState !== 'betting' && `(${calculateHandValue(playerHand)})`}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center min-h-[160px] items-center">
                {gameState !== 'betting' ? (
                  playerHand.map((card, index) => (
                    <div key={`player-${index}`} className="transform transition-transform hover:translate-y-[-5px]">
                      {renderCard(card)}
                    </div>
                  ))
                ) : (
                  <div className="text-team-silver opacity-50">Cards will appear here</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Current bet display - always visible */}
          <div className="text-center h-10 mb-4">
            <div className="text-xl font-display font-bold text-team-cream">
              Current Bet: <span className="text-team-gold">${currentBet}</span>
            </div>
          </div>
          
          {/* Game controls with consistent height */}
          <div className="h-32 space-y-4">
            {/* Betting chips - only shown in betting state */}
            <div className={`flex justify-center gap-4 transition-opacity duration-300 ${gameState === 'betting' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {CHIP_VALUES.map(value => (
                <button
                  key={value}
                  onClick={() => placeBet(value)}
                  disabled={bankroll < value || gameState !== 'betting'}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-headline text-sm tracking-wider
                    transform transition-all hover:scale-110 active:scale-95 border-2
                    ${value === 25 ? 'bg-team-gray border-team-gold/40 text-team-cream' :
                      value === 100 ? 'bg-team-gray border-team-gold/60 text-team-gold' :
                      'bg-team-gray border-team-gold text-team-gold'}
                    ${bankroll < value ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                  `}
                >
                  ${value}
                </button>
              ))}
            </div>
            
            {/* Game action buttons - consistent height container */}
            <div className="h-12 flex justify-center gap-4">
              {gameState === 'betting' && (
                <>
                  <Button
                    onClick={resetBet}
                    className="font-headline text-xs tracking-[0.15em] uppercase bg-team-gray border border-team-gold/30 text-team-silver hover:text-team-cream hover:border-team-gold/60"
                    disabled={currentBet <= 0}
                  >
                    Reset Bet
                  </Button>
                  <Button
                    onClick={startGame}
                    className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black border border-team-cream hover:bg-team-gold"
                    disabled={currentBet <= 0}
                  >
                    Deal
                  </Button>
                  {kidneysLeft > 0 ? (
                    <Button
                      onClick={sellKidney}
                      className="font-headline text-xs tracking-[0.15em] uppercase bg-team-gray border border-red-900/40 text-red-400 hover:border-red-700/60"
                    >
                      Sell Kidney (+${STARTING_BANKROLL})
                    </Button>
                  ) : (
                    <Button
                      onClick={resetGame}
                      className="font-headline text-xs tracking-[0.15em] uppercase bg-team-gray border border-team-gold/30 text-team-gold hover:border-team-gold/60"
                    >
                      Reset Game (Out of Kidneys)
                    </Button>
                  )}
                </>
              )}

              {gameState === 'playing' && (
                <>
                  <Button
                    onClick={hit}
                    className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black hover:bg-team-gold"
                  >
                    Hit
                  </Button>
                  <Button
                    onClick={stand}
                    className="font-headline text-xs tracking-[0.15em] uppercase bg-team-gray text-team-cream border border-team-gold/30 hover:border-team-gold/60"
                  >
                    Stand
                  </Button>
                  <Button
                    onClick={doubleDown}
                    className="font-headline text-xs tracking-[0.15em] uppercase bg-team-gold/20 text-team-gold border border-team-gold/40 hover:bg-team-gold/30"
                    disabled={bankroll < currentBet * 2}
                  >
                    Double Down
                  </Button>
                </>
              )}

              {gameState === 'gameOver' && (
                <Button
                  onClick={newHand}
                  className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black hover:bg-team-gold"
                >
                  New Hand
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Prizes Section */}
        <div className="mb-8">
          <h2 className="text-sm font-headline tracking-[0.3em] uppercase text-team-gold mb-6">Redeem Prizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRIZES.map(prize => (
              <div key={prize.id} className="vintage-card p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 flex justify-center">
                      {prize.image && (
                        <img
                          src={prize.image}
                          alt={prize.name}
                          className="w-24 h-24 object-contain"
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-display font-bold text-team-cream mb-2">
                      {prize.id === 'pbr' ? (
                        <span>
                          <span className="text-2xl text-team-gold">{pbrCount}</span> Warm PBR{pbrCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        prize.name
                      )}
                    </h3>
                    <p className="text-team-silver mb-4 flex-grow font-body italic">{prize.description}</p>

                    {prize.type === 'slider' ? (
                      <div className="space-y-3">
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
                          <span className="text-lg font-display font-bold text-team-gold">${prize.cost * pbrCount}</span>
                          <Button
                            onClick={() => redeemPrize(prize)}
                            className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black hover:bg-team-gold"
                            disabled={bankroll < prize.cost * pbrCount}
                          >
                            Redeem {pbrCount > 10 ? 'Bulk Order' : ''}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-display font-bold text-team-gold">${prize.cost}</span>
                        <Button
                          onClick={() => redeemPrize(prize)}
                          className="font-headline text-xs tracking-[0.15em] uppercase bg-team-cream text-team-black hover:bg-team-gold"
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

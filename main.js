// global variables
var deck = {};
var turn = "player";
var playerHand = [];
var computerHand = [];
var crib = [];
var communityCard;
var playerScore = 0;
var computerScore = 0;
var cardsPlayed = [];
var cribOwner = "";
var state = "";
var playerSelection;
var playerClicked = 0;
$(document).ready(function() {
    drawPegs();
    resetBoard();
});


// game flow controller
function gameSequence() {
    if (state == "pickPlayer") {
        //make board ready to select a dealer
        $('#instruction p').text("Please click the deck to have each player select a card at random");
        $('#deckspot').empty();
        $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
        $('#deckspot').click(dealerSelector);
    } else if (state == "deal") {

        $('#deckspot').empty();
        $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
        if (!findWinner()) {
            dealCards();
        }
    } else if (state == "fillCrib") {
        //make board ready to fillCrib
        if (!findWinner()) {
            fillCrib();
        }
    } else if (state == "pickCommunityCard") {
        //make board ready to pickCommunityCard
        localStorage.setItem('playerCards', JSON.stringify(playerHand));
        localStorage.setItem('computerCards', JSON.stringify(computerHand));
        if (!findWinner()) {
            pickCommunityCard();
        }
    } else if (state == "playPhase") {
        //make board ready for playPhase
        if (!findWinner()) {
            playPhase();
        }
    } else if (state == "resetPlayPhase") {
        if (!findWinner()) {
            resetPlayPhase();
        }
    } else if (state == "scoringPhase") {
        if (!findWinner()) {
            scoringPhase();
        }
    } else if (state == "turnTransitionPhase") {
        if (!findWinner()) {
            turnTransitionPhase();
        }
    } else if (state == "scorePlayerPhase") {
        if (!findWinner()) {
            scorePlayerPhase();
        }
    } else if (state == "scoreComputerPhase") {
        if (!findWinner()) {
            scoreComputerPhase();
        }
    } else if (state == "computerWon") {
        $('#instruction p').text('The Computer has WON!!!');
    } else if (state == "playerWon") {
        $('#instruction p').text('YOU WON!!!');
    }
}

// determin who goes first
function dealerSelector() {
    var computerCard = deck[Math.floor(Math.random() * 52)];
    $('#deckspot').prepend('<img src="img/cards/' + computerCard.name + '_of_' + computerCard.suit + '.png">');
    $('#instruction p').text("Computer has selected " + computerCard.name + ' of ' + computerCard.suit + ".");
    $('#deckspot').off('click');
    setTimeout(function() {
        var playerCard = deck[Math.floor(Math.random() * 52)];
        var text = "";
        $('#instruction p').text("You selected " + playerCard.name + " of " + playerCard.suit);
        $('#deckspot').append('<img src="img/cards/' + playerCard.name + '_of_' + playerCard.suit + '.png">');
        setTimeout(function() {
            if (playerCard.rank == computerCard.rank) {
                $('#instruction p').text("You tied, players will have to choose again");
                setTimeout(resetBoard, 1000);
            } else if (playerCard.rank < computerCard.rank) {
                $('#instruction p').text("You won, you are the dealer!");
                $('#upper p').text("Your Crib");
                cribOwner = "player";
                swapTurn();
                setTimeout(function() {
                    state = "deal";
                    gameSequence();
                }, 1500);
            } else {
                $('#instruction p').text("You lost, the computer is the dealer.");
                $('#upper p').text("Computer Crib");
                cribOwner = "computer";
                $('#deckspot').off('click');
                setTimeout(function() {
                    state = "deal";
                    gameSequence();
                }, 1500);
            }
        }, 1500);

    }, 2000);
}

//make deck, deal cards, sort by lowest to highest
function dealCards() {
    deck = {};
    deck = buildDeck();
    shuffle(deck);
    for (i = 0; i < 6; i++) {
        playerHand.push(deck[0]);
        deck.shift();
        computerHand.push(deck[0]);
        deck.shift();
    }
    playerHand.sort(function(a, b) {
        return a.rank - b.rank;
    });
    computerHand.sort(function(a, b) {
        return a.rank - b.rank;
    });
    drawCards();
    state = "fillCrib";
    gameSequence();
}


//computer randomly picks 2 cards to add to crib, assign click event to player cards.
function fillCrib() {
    $('#instruction p').text("Pick two cards to send to the crib.");
    var computerCrib0 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib0]);
    computerHand.splice(computerCrib0, 1);
    var computerCrib1 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib1]);
    computerHand.splice(computerCrib1, 1);
    drawCards();
    hideCrib();
    for (i = 0; i < playerHand.length; i++) {
        $("#p1c" + i).click(cardPlayerClicked);
    }
}

//player adds 2 cards to crib, then remove click event.
function sendToCrib() {
    crib.push(playerHand[playerSelection]);
    playerHand.splice(playerSelection, 1);
    drawCards();
    if (crib.length == 4) {
        drawCards();
        hideCrib();
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).off('click');
        }
        state = "pickCommunityCard";
        gameSequence();
    }
}

//randomly pick a card as the community card.  Score if it's a Jack
function pickCommunityCard() {
    if (cribOwner == "player") {
        $('#instruction p').text("Computer is picking a community card");
        communityCard = deck[Math.floor(Math.random() * deck.length)];
        setTimeout(function() {
            if (communityCard.name == "jack") {
                $('#instruction p').text("A Jack was drawn, two for his heels");
                if (turn == "player") {
                    computerScore += 2;
                    if (findWinner()){
                        return;
                    }
                    drawScore();
                    console.log("computer scored from Heels, score is " + computerScore);
                } else {
                    playerScore += 2;
                    if (findWinner()){
                        return;
                    }
                    console.log("player scored from Heels, score is " + playerScore);
                    drawScore();
                }
            }
            drawCards();
            console.log(communityCard.name + " has been selected, drawing cards, trying to enter playPhase next, with " + turn + " going first");
            state = "playPhase";
            gameSequence();
        }, 1500);
    } else {
        $('#instruction p').text("Pick a community card");
        $('#deckspot').click(function() {
            communityCard = deck[Math.floor(Math.random() * deck.length)];
            $('#deckspot').off('click');
            setTimeout(function() {
                if (communityCard.name == "jack") {
                    $('#instruction p').text("A Jack was drawn, two for his heels");
                    if (turn == "computer") {
                        computerScore += 2;
                        findWinner();
                        drawScore();
                        console.log("computer scored from Heels, score is " + computerScore);
                    } else {
                        playerScore += 2;
                        findWinner();
                        console.log("player scored from Heels, score is " + playerScore);
                        drawScore();
                    }
                }
            }, 1500);
            drawCards();
            console.log("communityCard picked, it was " + communityCard.name);
            state = "playPhase";
            gameSequence();
        });
    }
}

//calls other js files depending on who's turn it is
function playPhase() {
    setTimeout(function() {
        $('#instruction p').text(turn + "'s turn to play a card");
        if (turn == "computer") {
            computerTurn();
        } else if (turn == "player") {
            playerClicked = 0;
            playerTurn();
        } else {
            console.log('turn variable is FUBAR');
        }
    }, 1500);
}


//once play reaches 31 or no one can play, reset the board, unless hands are empty, then score
function resetPlayPhase() {
    if (playerHand.length === 0 && computerHand.length === 0) {
        console.log("all cards played, starting scoring");
        state = "scoringPhase";
        setTimeout(gameSequence, 1500);
    } else {
        swapTurn();
        cardsPlayed = [];
        $('#cardsplayed p').text("");
        drawCards();
        state = "playPhase";
        gameSequence();
    }
}

//controls if you click more than once, it shouldn't run more than one time.
function cardPlayerClicked() {
    playerClicked = 1;
    var id = event.target.parentElement.id;
    var cardPicked = id.substr(id.length - 1);
    console.log("player chose to play " + playerHand[cardPicked].name);
    playerSelection = cardPicked;
    setTimeout(function() {
        playerClicked = 0;
    }, 1000);
    if (state == "fillCrib") {
        playerClicked = 0;  //allows player to choose more than one card for the crib
        sendToCrib();
    } else if (state == "playPhase" && playerClicked == 1) {
        playerPlayCard();
    } else if (state == "playerGo" && playerClicked == 1) {
        playerPlayCard();
    }

}

//changes active player
function swapTurn() {
    if (turn == "player") {
        turn = "computer";
    } else {
        turn = "player";
    }
    console.log("next turn should be " + turn);
}


// keeps track of cards played running total.
function totalInPlay() {
    var sum = 0;
    for (i = 0; i < cardsPlayed.length; i++) {
        sum += cardsPlayed[i].value;
    }
    return sum;
}

// resets the board for new round after scoring phase.
function turnTransitionPhase() {
    console.log("reseting playPhase and setting next player");
    cardsPlayed = [];
    playerHand = [];
    computerHand = [];
    crib = [];
    communityCard = undefined;
    if (cribOwner == "player") {
        $('#upper p').text("Computer Crib");
        cribOwner = "computer";
    } else {
        $('#upper p').text("Your Crib");
        cribOwner = "player";
    }
    $('#cardsplayed p').text("");
    drawScore();
    swapTurn();
    state = "deal";
    gameSequence();

}

//checks to see if any card in a hand can be played.
function ableToPlay() {
    if (turn == "computer") {
        for (i = 0; i < computerHand.length; i++) {
            if ((computerHand[i].value + totalInPlay()) > 31) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        for (i = 0; i < playerHand.length; i++) {
            if ((playerHand[i].value + totalInPlay()) > 31) {
                return false;
            } else {
                return true;
            }
        }
    }

}
//initial setup of the game
function resetBoard() {
    deck = buildDeck();
    shuffle(deck);
    drawPegs();
    playerScore = 0;
    computerScore = 0;
    drawScore();
    playerHand = [];
    computerHand = [];
    crib = [];
    state = "pickPlayer";
    gameSequence();
}

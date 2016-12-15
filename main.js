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
$(document).ready(function() {
    drawPegs();
    resetBoard();
});

function gameSequence() { // game flow controller
    if (state == "pickPlayer") {
        //make board ready to select a dealer
        $('#instruction p').text("Please click the deck to have each player select a card at random");
        $('#deckspot').empty();
        $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
        $('#deckspot').click(dealerSelector);
    } else if (state == "deal") {
        $('#deckspot').empty();
        $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
        //make board ready to deal
        dealCards();
    } else if (state == "fillCrib") {
        //make board ready to fillCrib
        fillCrib();
    } else if (state == "pickCommunityCard") {
        //make board ready to pickCommunityCard
        localStorage.setItem('playerCards', JSON.stringify(playerHand));
        localStorage.setItem('computerCards', JSON.stringify(computerHand));
        pickCommunityCard();
    } else if (state == "playPhase") {
        //make board ready for playPhase
        playPhase();
    } else if (state == "resetPlayPhase") {
        resetPlayPhase();
    } else if (state == "scoringPhase"){
        scoringPhase();
    } else if (state == "turnTransitionPhase"){
        turnTransitionPhase();
    } else if (state == "scorePlayerPhase"){
        scorePlayerPhase();
    } else if (state == "scoreComputerPhase"){
        scoreComputerPhase();
    }
}

function dealerSelector() { //something's funky with this when it's a tie TODO look into this.
    var computerCard = deck[Math.floor(Math.random() * 52)];
    $('#deckspot').prepend('<img src="img/cards/' + computerCard.name + '_of_' + computerCard.suit + '.png">');
    $('#instruction p').text("Computer has selected " + computerCard.name + ' of ' + computerCard.suit + ".");
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
                $('#deckspot').off('click');
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
        }, 2000);

    }, 2500);
}

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

function fillCrib() {
    $('#instruction p').text("Pick two cards to send to the crib.");
    var computerCrib0 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib0]);
    computerHand.splice(computerCrib0, 1);
    var computerCrib1 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib1]);
    computerHand.splice(computerCrib1, 1);
    drawCards();
    for (i = 0; i < playerHand.length; i++) {
        $("#p1c" + i).click(cardPlayerClicked);
    }
}

function sendToCrib() {
    crib.push(playerHand[playerSelection]);
    playerHand.splice(playerSelection, 1);
    // $(event.target).remove('img')
    drawCards();
    if (crib.length == 4) {
        drawCards();
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).off('click');
        }
        state = "pickCommunityCard";
        gameSequence();
    }
}

function pickCommunityCard() {
    if (turn == "computer") {
        $('#instruction p').text("Computer is picking a community card");
        communityCard = deck[Math.floor(Math.random() * deck.length)];
        setTimeout(function() {
            if (communityCard.name == "jack") {
                $('#instruction p').text("A Jack was drawn, two for his heels");
                if (turn == "player") {
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
            drawCards();
            console.log(communityCard.name + " has been selected, drawing cards, trying to enter playPhase next, with " + turn + " going first");
            state = "playPhase";
            gameSequence();
        }, 1500);
    } else {
        $('#instruction p').text("Pick a community card");
        $('#deckspot').click(function() {
            communityCard = deck[Math.floor(Math.random() * deck.length)];
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
                        console.log("player scored from Heels, score is " +playerScore);
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

function playPhase() {
    // var lastPlayed = "";
    setTimeout(function() {
        $('#instruction p').text(turn + "'s turn to play a card");
        if (turn == "computer") {
            computerTurn();
        } else if (turn == "player") {
            playerTurn();
        } else {
            console.log('turn variable is FUBAR');
        }
    }, 1500);
}

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

function cardPlayerClicked() {
    //set the click handlers based on current state
    var id = event.target.parentElement.id;
    var cardPicked = id.substr(id.length - 1);
    console.log("player chose to play " + playerHand[cardPicked].name);
    playerSelection = cardPicked;
    if (state == "fillCrib") {
        sendToCrib();
    } else if (state == "playPhase") {
        playerPlayCard();
    } else if (state == "playerGo"){
        playerPlayCard();
    }

}

function swapTurn() {
    if (turn == "player") {
        turn = "computer";
    } else {
        turn = "player";
    }
    console.log("next turn should be " + turn);
}

function totalInPlay() {
    var sum = 0;
    for (i = 0; i < cardsPlayed.length; i++) {
        sum += cardsPlayed[i].value;
    }
    return sum;
}



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
    // drawCards();
    swapTurn();
    state = "deal";
    gameSequence();

}

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








// $('#p1c0').append('<img src="img/cards/' + test[0].rank + '_of_' + test[0].suit +'.png">'); //this draws the target card

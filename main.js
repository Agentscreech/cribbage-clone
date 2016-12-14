var deck = {};
var turn = "player";
var playerHand = [];
var playerPlayed = [];
var computerHand = [];
var computerPlayed = [];
var crib = [];
var communityCard;
var playerScore = 0;
var computerScore = 0;
var cardsPlayed = [];
var lastPlayed = "";
$(document).ready(function() {
    deck = buildDeck();
    shuffle(deck);
    drawPegs();
    resetBoard();
});

function gameSequence(state) {
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
        pickCommunityCard();
    } else if (state == "playPhase") {

        //make board ready for playPhase
        playPhase();
    }


}

function swapTurn() {
    if (turn == "player") {
        turn = "computer";
    } else {
        turn = "player";
    }
}

function totalInPlay() {
    var sum = 0;
    for (i = 0; i < cardsPlayed.length; i++) {
        sum += cardsPlayed[i].value;
    }
    return sum;
}

function playCard() {
    var pointsEarned = 0;
    if (turn == "computer") {
        //make the computer play a card at random
        var cardToPlay = Math.floor(Math.random() * computerHand.length);
        console.log("computer chose to play " + computerHand[cardToPlay]);
        cardsPlayed.push(computerHand[cardToPlay]);
        computerHand.splice(cardToPlay, 1);
        drawCards();
        $('#cardsplayed p').text(totalInPlay());
        if (totalInPlay() == 31) {
            computerScore += 1;
        }
        pointsEarned = checkIfScored(cardsPlayed);
        console.log("computer earned " + pointsEarned + " points");
        computerScore += pointsEarned;
        drawScore();
        swapTurn();
        console.log("computer turn has ended swapping turns to " + turn);
        gameSequence("playPhase");
    } else {
        //enable the player to choose a card to play.
        var id = event.target.parentElement.id;
        var cardPicked = id.substr(id.length - 1);
        console.log("player chose to play " + playerHand[cardPicked]);
        cardsPlayed.push(playerHand[cardPicked]);
        playerHand.splice(cardPicked, 1);
        $('#cardsplayed p').text(totalInPlay());
        drawCards();
        if (totalInPlay() == 31) {
            playerScore += 1;
        }
        pointsEarned = checkIfScored(cardsPlayed);
        console.log("player earned " + pointsEarned + " points");
        playerScore += pointsEarned;
        drawScore();
        swapTurn();
        gameSequence("playPhase");
    }
}

function playerTurn() {
    //this is what will happen when it's the players turn
    console.log("testing to see if "+turn+" can play");
    if (!ableToPlay()) {
        console.log(turn + " wasn't able to play");
        swapTurn();
        saidGo();
    } else {
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).click(playCard);
        }
    }

}

function computerTurn() {
    //this is what happens when it's the computer's turn
    console.log("testing to see if "+turn+" can play");
    if (!ableToPlay()) {
        swapTurn();
        saidGo();
    } else {
        playCard();
    }
}

function saidGo(toldGo) {
    if (toldGo) {
        if (ableToPlay()) {
            //current player play a card, if it's computer, sort their hand from low to high and play the lowest card.
            if (turn == "computer") {
                cardsPlayed.push(computerHand[0]);
                computerHand.splice(0, 1);
                drawCards();
                $('#cardsplayed p').text(totalInPlay());
                if (totalInPlay() == 31) {
                    computerScore += 1;
                }
                pointsEarned = checkIfScored(cardsPlayed);
                console.log("computer earned " + pointsEarned + " points");
                computerScore += pointsEarned;
                drawScore();
            } else {
                checkIfScored(cardsPlayed);
                var went = true;
                saidGo(went);
            }
        } else {
            var id = event.target.parentElement.id;
            var cardPicked = id.substr(id.length - 1);
            console.log("player chose to play " + playerHand[cardPicked]);
            cardsPlayed.push(playerHand[cardPicked]);
            playerHand.splice(cardPicked, 1);
            $('#cardsplayed p').text(totalInPlay());
            drawCards();
            if (totalInPlay() == 31) {
                playerScore += 1;
            }
            pointsEarned = checkIfScored(cardsPlayed);
            console.log("player earned " + pointsEarned + " points");
            playerScore += pointsEarned;
            drawScore();
            var went = false; //jshint ignore:line
            saidGo(went);
        }

    } else {
        if (turn == "player") {
            playerScore += 1;
            drawScore();
        } else {
            computerScore += 1;
            drawScore();
        }
    }
    //last player score +1, swapturn, reset totalInPlay, goto playPhase
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

function playPhase() {
    console.log(turn + " should be going now");
    $('#instruction p').text(turn + "'s turn to play a card");
    // var lastPlayed = "";
    setTimeout(function() {
        if (turn == "computer") {
            computerTurn();
        } else if (turn == "player") {
            playerTurn();
        } else {
            console.log('turn variable is FUBAR');
        }
    }, 2000);



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
    gameSequence("pickPlayer");


}


function dealerSelector() { //something's funky with this when it's a tie TODO look into this.
    var computerCard = deck[Math.floor(Math.random() * 52)];
    // console.log("computer selected " + computerCard.name + " of " + computerCard.suit);
    $('#deckspot img').remove();
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
                setTimeout(resetBoard, 1500);
            } else if (playerCard.rank < computerCard.rank) {
                $('#instruction p').text("You won, you are the dealer!");
                $('#upper p').text("Your Crib");
                swapTurn();
                $('#deckspot').off('click');
                setTimeout(function() {
                    gameSequence("deal");
                }, 1500);
            } else {
                $('#instruction p').text("You lost, the computer is the dealer.");
                $('#upper p').text("Computer Crib");
                $('#deckspot').off('click');
                setTimeout(function() {
                    gameSequence("deal");
                }, 1500);
            }
        }, 2000);

    }, 1000);
}


function dealCards() {
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
    gameSequence("fillCrib");
}

function fillCrib() {
    $('#instruction p').text("Pick two cards to send to the crib.");
    var computerCrib0 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib0]);
    computerHand.splice(computerCrib0, 1);
    var computerCrib1 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib1]);
    computerHand.splice(computerCrib1, 1);
    computerPlayed = computerHand;
    for (i = 0; i < playerHand.length; i++) {
        $("#p1c" + i).click(sendToCrib);
    }
}

function sendToCrib(event) {
    var id = event.target.parentElement.id;
    var cardPicked = id.substr(id.length - 1);
    crib.push(playerHand[cardPicked]);
    playerHand.splice(cardPicked, 1);
    // $(event.target).remove('img')
    drawCards();
    if (crib.length == 4) {
        playerPlayed = playerHand;
        drawCards();
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).off('click');
        }
        gameSequence("pickCommunityCard");
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
                    drawScore();
                } else {
                    playerScore += 2;
                    drawScore();
                }
            }
            drawCards();
            console.log(communityCard.name + " has been selected, drawing cards, trying to enter playPhase next, with " + turn + " going first");
            gameSequence("playPhase");
        }, 1500);
    } else {
        $('#instruction p').text("Pick a community card");
        $('#deckspot').click(function() {
            communityCard = deck[Math.floor(Math.random() * deck.length)];
            if (communityCard.name == "jack") {
                $('#instruction p').text("A Jack was drawn, two for his heels");
                if (turn == "computer") {
                    computerScore += 2;
                    drawScore();
                } else {
                    playerScore += 2;
                    drawScore();
                }
            }
            drawCards();
            console.log("communityCard picked, trying to go to playPhase with the active player is " + turn);
            gameSequence("playPhase");
        });
    }
}

//  BUILD AND DRAW THINGS SECTION

function drawCards() {
    $('#cribhome img').remove();
    $('#cardrow img').remove();
    $('#communitycard img').remove();
    $('#cardsplayed img').remove();
    for (i = 0; i < playerHand.length; i++) {
        $('#p1c' + i).append('<img src="img/cards/' + playerHand[i].name + '_of_' + playerHand[i].suit + '.png">');
    }
    for (i = 0; i < computerHand.length; i++) {
        $('#p2c' + i).append('<img src="img/cards/' + computerHand[i].name + '_of_' + computerHand[i].suit + '.png">');
    }
    for (j = 0; j < crib.length; j++) {
        $('#crib' + j).append('<img src="img/cards/' + crib[j].name + '_of_' + crib[j].suit + '.png">');
    }
    for (k = 0; k < cardsPlayed.length; k++) {
        $('#cp' + k).append('<img src="img/cards/' + cardsPlayed[k].name + '_of_' + cardsPlayed[k].suit + '.png">');

    }
    if (communityCard !== undefined) {
        $('#communitycard').append('<img src="img/cards/' + communityCard.name + '_of_' + communityCard.suit + '.png">');
    }
}



function drawScore() {
    drawPegs();
    $("#p2peg" + computerScore).attr('src', "img/BlueDot.gif");
    $("#p1peg" + playerScore).attr('src', "img/RedDot.gif");
    $('#p1score p').text("Player 1 score: " + playerScore);
    $('#p2score p').text("Player 2 score: " + computerScore);

}


function drawPegs() {
    $('#p1toprow').empty();
    $('#p2toprow').empty();
    $('#p1upmidrow').empty();
    $('#p2upmidrow').empty();
    $('#p1midrow').empty();
    $('#p2midrow').empty();
    $('#p1btrow').empty();
    $('#p2btrow').empty();
    for (i = 91; i < 121; i++) {
        $('#p1toprow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2toprow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 90; i > 60; i--) {
        $('#p1upmidrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2upmidrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 31; i < 61; i++) {
        $('#p1midrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2midrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 30; i > 0; i--) {
        $('#p1btrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2btrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
}

function Card(value, name, suit, rank) {
    this.value = value;
    this.name = name;
    this.suit = suit;
    this.rank = rank;
}

function buildDeck() {
    this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    this.suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    var cards = [];

    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            if (n < 10) {
                cards.push(new Card(n + 1, this.names[n], this.suits[s], n + 1));
            } else {
                cards.push(new Card(10, this.names[n], this.suits[s], n + 1));
            }
        }
    }

    return cards;
}

function shuffle(array) {
    var numberOfCards = array.length,
        temp, randomCard;
    while (numberOfCards) {
        randomCard = Math.floor(Math.random() * numberOfCards--);
        temp = array[numberOfCards];
        array[numberOfCards] = array[randomCard];
        array[randomCard] = temp;
    }

    return array;
}


// $('#p1c0').append('<img src="img/cards/' + test[0].rank + '_of_' + test[0].suit +'.png">'); //this draws the target card

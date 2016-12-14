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
var cribOwner = "";
var state = "";
$(document).ready(function() {
    deck = buildDeck();
    shuffle(deck);
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
    console.log("next turn should be " + turn);
}

function totalInPlay() {
    var sum = 0;
    for (i = 0; i < cardsPlayed.length; i++) {
        sum += cardsPlayed[i].value;
    }
    return sum;
}


function scoringPhase() {
    computerPlayed.push(communityCard);
    playerPlayed.push(communityCard);
    var computerPoints = 0;
    var playerPoints = 0;
    if (cribOwner == "player") {
        playerPoints += checkIfScored(crib);
        playerPoints += score15s(crib);
    } else {
        computerPoints += checkIfScored(crib);
        computerPoints += score15s(crib);
    }


    setTimeout(function() {
        computerPoints += checkIfScored(computerPlayed);
        computerPoints += score15s(computerPlayed);
        computerScore += computerPoints;
        $('#instruction p').text("Computer scored " + computerPoints + " points.");
    }, 1500);
    setTimeout(function() {
        playerPoints += checkIfScored(playerPlayed);
        playerPoints += score15s(playerPlayed);
        playerScore += playerPoints;
        $('#instruction p').text("Player scored " + playerPoints + " points.");
    }, 1500);
    drawScore();
    playerPoints += score15s(playerPlayed);
    playerScore += playerPoints;
    drawScore();
    resetPlayPhase();
}

function turnTransitionPhase() {
    console.log("reseting playPhase and setting next player");
    cardsPlayed = [];
    playerHand = [];
    computerHand = [];
    crib = [];
    communityCard = [];
    if (cribOwner == "player") {
        $('#upper p').text("Computer Crib");
        cribOwner = "computer";
    } else {
        $('#upper p').text("Your Crib");
    }
    $('#upper p').text("");
    drawScore();
    // drawCards();
    swapTurn();
    gameSequence("deal");

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
                cribOwner = "computer";
                swapTurn();
                $('#deckspot').off('click');
                setTimeout(function() {
                    gameSequence("deal");
                }, 1500);
            } else {
                $('#instruction p').text("You lost, the computer is the dealer.");
                $('#upper p').text("Computer Crib");
                cribOwner = "computer";
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

// function playCard() {
//     var pointsEarned = 0;
//
//     } else {
//
//     }
// }



// function saidGo(toldGo) {
//     console.log("someone said go" + toldGo);
//     if (toldGo === undefined) { // basically the first time something called this.
//         if (ableToPlay()) {
//             //current player play a card, if it's computer, sort their hand from low to high and play the lowest card.
//             if (turn == "computer") {
//                 cardsPlayed.push(computerHand[0]);
//                 computerHand.splice(0, 1);
//                 drawCards();
//                 $('#cardsplayed p').text(totalInPlay());
//                 if (totalInPlay() == 31) {
//                     computerScore += 1;
//                 }
//                 pointsEarned = checkIfScored(cardsPlayed);
//                 console.log("computer earned " + pointsEarned + " points");
//                 computerScore += pointsEarned;
//                 drawScore();
//             } else {
//                 // for (i = 0; i < playerHand.length; i++) {
//                 //     $("#p1c" + i).click(playCard);  // find a way to only enable cards eligible to play in the play card function.
//                 // }
//                 var id = event.target.parentElement.id;
//                 var cardPicked = id.substr(id.length - 1);
//                 console.log("player chose to play " + playerHand[cardPicked]);
//                 cardsPlayed.push(playerHand[cardPicked]);
//                 playerHand.splice(cardPicked, 1);
//                 $('#cardsplayed p').text(totalInPlay());
//                 drawCards();
//                 if (totalInPlay() == 31) {
//                     playerScore += 1;
//                 }
//                 pointsEarned = checkIfScored(cardsPlayed);
//                 console.log("player earned " + pointsEarned + " points");
//                 playerScore += pointsEarned;
//                 drawScore();
//                 var went = true;
//                 saidGo(went);
//             }
//         } else {
//
//             var went = false; //jshint ignore:line
//             saidGo(went);
//         }
//
//     } else {
//         if (turn == "player") {
//             playerScore += 1;
//             drawScore();
//         } else {
//             computerScore += 1;
//             drawScore();
//         }
//         //score hands and owners crib then reset the playPhase
//         console.log("no one can play, the playPhase is over.  Tallying scores");
//         $('#instruction p').text("No player can play, tallying scores");
//         setTimeout(scoringPhase, 1000);
//     }
// }


// $('#p1c0').append('<img src="img/cards/' + test[0].rank + '_of_' + test[0].suit +'.png">'); //this draws the target card

function scoringPhase() { // this should be called when play phase is over and we need to score the 3 sets of hands.
    if (cribOwner == "computer") {
        state = "scorePlayerPhase";
        gameSequence();
    } else if (cribOwner == "player") {
        state = "scoreComputerPhase";
        gameSequence();
    }
    showCrib();
    $('#cardsplayed img').remove();
    $('#cardsplayed p').text("");
}

function scoreCrib() {
    if (findWinner()) {
        return;
    }
    var computerPoints = 0;
    var playerPoints = 0;
    crib.push(communityCard);
    if (cribOwner == "computer") {
        computerPoints += scoreAll(crib);
        computerScore += computerPoints;
        console.log("computer crib was worth " + computerPoints);
        $('#instruction p').text("Crib was worth " + computerPoints + " points for the computer.");
        drawScore();
    } else if (cribOwner == "player") {
        playerPoints += scoreAll(crib);
        playerScore += playerPoints;
        console.log("player's crib was worth " + playerPoints);
        $('#instruction p').text("Crib was worth " + playerPoints + " points for the player.");
        drawScore();
    } else {
        //go to next phase
    }
}

function scorePlayerPhase() {
    playerPlayed = JSON.parse(localStorage.getItem('playerCards'));
    drawPlayer(playerPlayed);
    playerPlayed.push(communityCard);
    var playerPoints = 0;
    playerPoints += scoreAll(playerPlayed);
    playerScore += playerPoints;
    console.log("Player scored " + playerPoints + " points.");
    $('#instruction p').text("Player scored " + playerPoints + " points.");
    drawScore();
    if (!findWinner()) {
        console.log("player scored from their Hand, score is " + playerScore);
        setTimeout(function() {
            if (cribOwner == "computer") {
                state = "scoreComputerPhase";
                gameSequence();
            } else {
                scoreCrib();
                setTimeout(function() {
                    state = "turnTransitionPhase";
                    gameSequence();
                }, 4000);
            }
        }, 1500);
    }
}

function scoreComputerPhase() {
    computerPlayed = JSON.parse(localStorage.getItem('computerCards'));
    drawComputer(computerPlayed);
    computerPlayed.push(communityCard);
    var computerPoints = 0;
    computerPoints += scoreAll(computerPlayed);
    computerScore += computerPoints;
    console.log("Computer scored " + computerPoints + " points.");
    $('#instruction p').text("Computer scored " + computerPoints + " points.");
    drawScore();
    if (!findWinner()) {
        console.log("computer scored from their Hand, score is " + computerScore);
        setTimeout(function() {
            if (cribOwner == "player") {
                state = "scorePlayerPhase";
                gameSequence();
            } else {
                scoreCrib();
                setTimeout(function() {
                    state = "turnTransitionPhase";
                    gameSequence();
                }, 4000);
            }
        }, 1500);
    }
}

function findWinner() {
    if (computerScore >= 121) {
        console.log("computer has won");
        state = "computerWon";
        gameSequence();
        return true;
    } else if (playerScore >= 121) {
        state = "playerWon";
        console.log("player has won");
        gameSequence();
        return true;
    } else {
        return false;
    }

}

function scoreOnPlay(cardsPlayed) { // turn this into the function that scores after each card is played.
    if (cardsPlayed === undefined) {
        return 0;
    }
    var tempArray = [];
    var points = 0;
    if (totalInPlay() == 15) {
        points += 2;
    }
    if (totalInPlay() == 31) {
        points++;
    }
    if (cardsPlayed.length > 2){
        tempArray.push(cardsPlayed[cardsPlayed.length - 1], cardsPlayed[cardsPlayed.length - 2], cardsPlayed[cardsPlayed.length - 3]);
        if(scoreSequence(tempArray)){
            points += 3;
        }
    }
    if (cardsPlayed.length > 1) {
        if (cardsPlayed[cardsPlayed.length - 1].name == cardsPlayed[cardsPlayed.length - 2].name) {
            points += 2;
            if (cardsPlayed.length > 2) {
                if (cardsPlayed[cardsPlayed.length - 2].name == cardsPlayed[cardsPlayed.length - 3].name) {
                    points += 4;
                    if (cardsPlayed.length > 3)
                        if (cardsPlayed[cardsPlayed.length - 3].name == cardsPlayed[cardsPlayed.length - 4].name) {
                            points += 6;
                    }
                }
            }
        }
    }
    console.log(points + " awarded for that play");
    return points;
}








function scoreAll(hand) {
    var points = 0;
    for (i=0;i<hand.length;i++){
        if (hand[i].name == "jack" && hand[i].suit == communityCard.suit){ //checks for "nobs" point (you have the jack of the suit that was drawn)
            points++;
        }
    }
    points += scoreFlush(hand);
    points += scoreOfAKind(hand);
    points += score15s(hand);
    var combos = Combinatorics.combination(hand, 3);
    var combo = combos.next();
    while (combo) {
        var score = scoreSequence(combo);
        points += score;
        combo = combos.next();
    }
    return points;
}

function scoreFlush(hand) {
    var points = 0;
    if (hand[0].suit == hand[1].suit && hand[0].suit == hand[2].suit && hand[0].suit == hand[3].suit && hand[0].suit == hand[4].suit) {
        points += 5;
        return points;
    } else if (hand[0].suit == hand[1].suit && hand[0].suit == hand[2].suit && hand[0].suit == hand[3].suit) {
        points += 4;
        return points;
    } else {
        return 0;
    }
}



function scoreOfAKind(cards) { //might have trouble for the in play portion
    var names = [];
    for (i = 0; i < cards.length; i++) { //grabs the names of the cards to compare for pairs and puts it into a new array
        names.push(cards[i].name);
    }
    names.sort(function(a, b) { // sorts the numbers from smallest to largest
        return a - b;
    });
    var total = 0;
    for (i = 0; i < names.length; i++) {
        for (j = i; j < names.length; j++) {
            if (i != j) {
                if (names[i] == names[j]) {
                    total += 2;
                }
            }
        }
    }
    return total;
}

function score15s(cards) { // grabs binary position representation of 2 or more cards and then adds them, if they equal 15, then score 2 points, returning totall points.
    var points = 0;
    for (var combo = 1; combo <= ((2 ** cards.length) - 1); combo++) { //jshint ignore:line
        var sum = 0;
        for (var pos = 0; pos <= cards.length; pos++) {
            if (((combo >> pos) & 1) == 1) {
                sum += cards[pos].value; //looks at each position and if there is a "card" there, if so, it totals them.  ex. you want to add card[0] and card[3].  That would look like 01001 positionally (index0 is furthest right, index4 is furthest left).  This is comparison combination is represented as 9 in decimal. For each postion, bitshift it right by 0,1,2, or 3.  If after you do that, if there is a 1 in the right most postion, take the index equal to the amount that you shifted of the card array.  In this case, 0 and 3.
            }
        }
        if (sum == 15) points += 2;
    }
    return points;
}

function scoreSequence(cards) {
    cards.sort(function(a, b) {
        return a.rank - b.rank;
    });
    for (var i = 0; i < cards.length - 1; i++) {
        if (cards[i].rank + 1 != cards[i + 1].rank) {
            return false;
        }
    }
    return true;
}

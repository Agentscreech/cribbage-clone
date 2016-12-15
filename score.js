function scoringPhase() { // this should be called when play phase is over and we need to score the 3 sets of hands.
    computerPlayed = JSON.parse(localStorage.getItem('computerCards'));
    playerPlayed = JSON.parse(localStorage.getItem('playerCards'));
    computerPlayed.push(communityCard);
    playerPlayed.push(communityCard);
    var computerPoints = 0;
    var playerPoints = 0;
    if (cribOwner == "player") {
        playerPoints += scoreAll(crib);
        $('#instruction p').text("Crib was worth " + playerPoints + " points for the player.");
    } else {
        computerPoints += scoreAll(crib);
        $('#instruction p').text("Crib was worth " + computerPoints + " points for the computer.");
    }
    setTimeout(function() {
        computerPoints += scoreAll(computerPlayed);
        computerScore += computerPoints;
        $('#instruction p').text("Computer scored " + computerPoints + " points.");
        if (computerScore >= 121){
            console.log("computer won");
            drawWinner("computer");
        } else {}
    }, 1500);
    setTimeout(function() {
        playerPoints += scoreAll(playerPlayed);
        playerScore += playerPoints;
        $('#instruction p').text("Player scored " + playerPoints + " points.");
        if (playerScore >= 121){
            console.log("player won");
            drawWinner("player");
        } else {
            drawScore();
            state = "turnTransitionPhase";
            setTimeout(gameSequence,2000);
        }
    }, 3000);
}

function drawWinner(whoWon) {
    $('#instruction p').text(whoWon + " WON!!!");
}

function scoreOnPlay(cardsPlayed) { // turn this into the function that scores after each card is played.
    var totalScore = 0;
    var pairs = scoreOfAKind(cardsPlayed);
    // var runs = scoreSequence(cardsPlayed);
    if (cardsPlayed.length > 2) {
        var combos = Combinatorics.combination(cardsPlayed, 3);
        var combo = combos.next();
        while (combo) {
            var score = scoreSequence(combo);
            totalScore += score;
            combo = combos.next();
        }
    }
    totalScore += pairs;
    return totalScore;
}
//     console.log(combo);
// var hand = [1, 2, 2, 3, 3];

function scoreAll(hand) {
    var points = 0;
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

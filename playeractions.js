function playerPlayCard() {
    if (turn == "computer") { //jump out if it's still the computer's turn
        return false;
    } else if (state !== "playerGo") {
        if (playerHand[playerSelection].value + totalInPlay() > 31) {
            $('#instruction p ').text('Unable to play that card, choose another one');
            playerTurn();
            return false;
        } else {
            cardsPlayed.push(playerHand[playerSelection]);
            playerHand.splice(playerSelection, 1);
            $('#cardsplayed p').text(totalInPlay());
            drawCards();
            playerScore += scoreOnPlay(cardsPlayed);
            drawScore();
            if (!findWinner()) {
                swapTurn();
                state = "playPhase";
                gameSequence();
                playerClicked = 0;
            }
        }
    } else {
        if (playerHand[playerSelection].value + totalInPlay() > 31) {
            $('#instruction p ').text('Unable to play that card, choose another one');
            playerTurn();
        } else {
            cardsPlayed.push(playerHand[playerSelection]);
            playerHand.splice(playerSelection, 1);
            $('#cardsplayed p').text(totalInPlay());
            drawCards();
            playerScore += scoreOnPlay(cardsPlayed);
            drawScore();
            if (!findWinner()) {
                computerSaidGo();
                playerClicked = 0;
            }
        }

    }
}

function playerTurn() {
    //this is what will happen when it's the players turn
    if (!ableToPlay()) {
        console.log("player wasn't able to play");
        swapTurn();
        $('#instruction p').text("You can not make a move, you say 'GO'");
        setTimeout(playerSaidGo, 1500);
    } else {
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).click(cardPlayerClicked);
        }
    }

}

function computerSaidGo() {
    state = "playerGo";
    console.log("computer said Go");
    if (ableToPlay()) {
        playerClicked = 0;
        playerTurn();
    } else {
        playerScore += 1;
        drawScore();
        if (!findWinner()) {
            console.log("player scored from Go, Score is " + playerScore);
            setTimeout(function() {
                $('#instruction p').text("Player scores 1 for the Go/Last");
            }, 1000);
            state = "resetPlayPhase";
            console.log("player can't go, resetting play phase");
            $('#instruction p').text("You can no longer make a move, the round is over");
            setTimeout(gameSequence, 1000);
        }

    }
}

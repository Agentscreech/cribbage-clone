// allows player to select and play card.
function playerPlayCard() {
    if (turn == "computer") { //jump out if it's still the computer's turn, keeps from playing out of turn
        return false;
    } else if (state !== "playerGo") { //the computer has not said go yet
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

//this is what will happen when it's the players turn.
function playerTurn() {
    if (!ableToPlay()) {
        swapTurn();
        $('#instruction p').text("You can not make a move, you say 'GO'");
        setTimeout(playerSaidGo, 1500);
    } else {
        for (i = 0; i < playerHand.length; i++) {
            $("#p1c" + i).click(cardPlayerClicked);
        }
    }

}

//Go phase for the player
function computerSaidGo() {
    state = "playerGo";
    if (ableToPlay()) {
        playerClicked = 0;
        playerTurn();
    } else {
        playerScore += 1;
        drawScore();
        if (!findWinner()) {
            setTimeout(function() {
                $('#instruction p').text("Player scores 1 for the Go/Last");
            }, 1000);
            state = "resetPlayPhase";
            $('#instruction p').text("You can no longer make a move, the round is over");
            setTimeout(gameSequence, 1000);
        }

    }
}

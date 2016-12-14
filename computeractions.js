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
    } else if (totalInPlay() == 15) {
        computerScore += 2;
    }
    pointsEarned = checkIfScored(cardsPlayed);
    console.log("computer earned " + pointsEarned + " points");
    computerScore += pointsEarned;
    drawScore();
    swapTurn();
    gameSequence("playPhase");

}

function computerTurn() {
    //this is what happens when it's the computer's turn
    console.log("testing to see if " + turn + " can play");
    if (!ableToPlay()) {
        swapTurn();
        saidGo();
    } else {
        playCard();
    }
}

function saidGo(toldGo) {
    console.log("someone said go" + toldGo);
    if (toldGo === undefined) { // basically the first time something called this.
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
                // for (i = 0; i < playerHand.length; i++) {
                //     $("#p1c" + i).click(playCard);  // find a way to only enable cards eligible to play in the play card function.
                // }
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
                var went = true;
                saidGo(went);
            }
        } else {

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
        //score hands and owners crib then reset the playPhase
        console.log("no one can play, the playPhase is over.  Tallying scores");
        $('#instruction p').text("No player can play, tallying scores");
        setTimeout(scoringPhase, 1000);
    }
}

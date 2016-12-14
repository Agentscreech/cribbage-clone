//enable the player to choose a card to play.
var id = event.target.parentElement.id;
var cardPicked = id.substr(id.length - 1);
console.log("player chose to play " + playerHand[cardPicked]);
cardsPlayed.push(playerHand[cardPicked]);
playerHand.splice(cardPicked, 1);
for (i = 0; i < playerHand.length; i++) {
    $("#p1c" + i).off('click');
}
$('#cardsplayed p').text(totalInPlay());
drawCards();
if (totalInPlay() == 31) {
    playerScore += 1;
} else if (totalInPlay() == 15) {
    computerScore += 2;
}
pointsEarned = checkIfScored(cardsPlayed);
console.log("player earned " + pointsEarned + " points");
playerScore += pointsEarned;
drawScore();
swapTurn();
gameSequence("playPhase");


function playerTurn() {
    //this is what will happen when it's the players turn
    console.log("testing to see if " + turn + " can play");
    if (!ableToPlay()) {
        console.log(turn + " wasn't able to play");
        swapTurn();
        saidGo();
    } else {
        for (i = 0; i < playerHand.length; i++) {
            console.log("looping for card " + playerHand[i].name);
            // var test = playerHand[i].value + totalInPlay();
            // console.log(test +"sum total value of player card and total cards in play");
            // if (test < 32){
            console.log(playerHand[i].name + " should be able to be played");
            $("#p1c" + i).click(playCard);
            // } else {
            // return false;
            // }
        }
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

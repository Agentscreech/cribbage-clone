function playerPlayCard() {
    if (state !== "playerGo") {
        if (playerHand[playerSelection].value + totalInPlay() > 32) {
            $('#instruction p ').text('Unable to play that card, choose another one');
            playerTurn();
        } else {
            cardsPlayed.push(playerHand[playerSelection]);
            playerHand.splice(playerSelection, 1);
            $('#cardsplayed p').text(totalInPlay());
            drawCards();
            // scoreOnPlay();
            swapTurn();
            console.log("it was the players turn, now it should have switched to the computer");
            state = "playPhase";
            gameSequence();
        }

    } else {
        if (playerHand[playerSelection].value + totalInPlay() > 32) {
            $('#instruction p ').text('Unable to play that card, choose another one');
            playerTurn();
        } else {
            cardsPlayed.push(playerHand[playerSelection]);
            playerHand.splice(playerSelection, 1);
            $('#cardsplayed p').text(totalInPlay());
            drawCards();
            // scoreOnPlay();
            computerSaidGo();
        }

    }
}
// for (i = 0; i < playerHand.length; i++) {
//     $("#p1c" + i).off('click');
// }


function playerTurn() {
    //this is what will happen when it's the players turn
    console.log("testing to see if player can play");
    if (!ableToPlay()) {
        console.log("player wasn't able to play");
        swapTurn();
        $('#instruction p').text("You can not make a move, you say 'GO'");
        playerSaidGo();
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
        playerTurn();
    } else {
        //playerScore += 1
        state = "resetPlayPhase";
        console.log("player can't go, resetting play phase");
        $('#instruction p').text("You can no longer make a move, the round is over");
        setTimeout(gameSequence, 1500);
    }

}

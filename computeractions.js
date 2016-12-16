function computerPlayCard() {
    //make the computer play a card at random
    var cardToPlay = Math.floor(Math.random() * computerHand.length);
    if ((computerHand[cardToPlay].value + totalInPlay()) > 31) {
        console.log('Computer picked an invalid card');
        computerPlayCard();
    } else {
        cardsPlayed.push(computerHand[cardToPlay]);
        computerHand.splice(cardToPlay, 1);
        drawCards();
        $('#cardsplayed p').text(totalInPlay());
        //scoreOnPlay();
        swapTurn();
        state = "playPhase";
        gameSequence();
    }
}

function computerTurn() {
    //this is what happens when it's the computer's turn
    if (!ableToPlay()) {
        swapTurn();
        $('#instruction p').text("Computer can not make a move, it says 'GO'");
        computerSaidGo();
    } else {
        computerPlayCard();
    }
}

function playerSaidGo() {
    console.log("player said go");
    if (ableToPlay()) {
        cardsPlayed.push(computerHand[0]); //forces computer to play it's smallest value card
        computerHand.splice(0, 1);
        drawCards();
        $('#cardsplayed p').text(totalInPlay());
        // scoreOnPlay();
        setTimeout(playerSaidGo, 1500);
    } else {
        computerScore += 1;
        drawScore();
        if (!findWinner()) {
            console.log("computer scored from Go, score is " + computerScore);
            setTimeout(function() {
                $('#instruction p').text("Computer scores 1 for the Go/Last");
            }, 1000);
            state = "resetPlayPhase";
            console.log("computer can't go, resetting play phase");
            $('#instruction p').text("Computer can no longer make a move, the round is over");
            setTimeout(gameSequence, 1000);
        }
    }
}

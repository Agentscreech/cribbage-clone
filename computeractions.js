//make the computer play a card at random
function computerPlayCard() {
    var cardToPlay = Math.floor(Math.random() * computerHand.length);
    if ((computerHand[cardToPlay].value + totalInPlay()) > 31) {
        computerPlayCard();
    } else {
        cardsPlayed.push(computerHand[cardToPlay]);
        computerHand.splice(cardToPlay, 1);
        drawCards();
        $('#cardsplayed p').text(totalInPlay());
        computerScore += scoreOnPlay(cardsPlayed);
        drawScore();
        if (!findWinner()) {
            swapTurn();
            state = "playPhase";
            gameSequence();

        }
    }
}

//this is what happens when it's the computer's turn
function computerTurn() {
    if (!ableToPlay()) {
        swapTurn();
        $('#instruction p').text("Computer can not make a move, it says 'GO'");
        setTimeout(computerSaidGo, 1500);
    } else {
        computerPlayCard();
    }
}

function playerSaidGo() {
    if (ableToPlay()) {
        cardsPlayed.push(computerHand[0]); //forces computer to play it's smallest value card
        computerHand.splice(0, 1);
        drawCards();
        $('#cardsplayed p').text(totalInPlay());
        computerScore += scoreOnPlay();
        drawScore();
        if (!findWinner()){
            setTimeout(playerSaidGo, 1500);
        }
    } else {
        computerScore += 1;
        drawScore();
        if (!findWinner()) {
            setTimeout(function() {
                $('#instruction p').text("Computer scores 1 for the Go/Last");
            }, 1000);
            state = "resetPlayPhase";
            $('#instruction p').text("Computer can no longer make a move, the round is over");
            setTimeout(gameSequence, 1000);
        }
    }
}

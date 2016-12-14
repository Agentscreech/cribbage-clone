function drawCards() {
    $('#cribhome img').remove();
    $('#cardrow img').remove();
    $('#communitycard img').remove();
    $('#cardsplayed img').remove();
    for (i = 0; i < playerHand.length; i++) {
        $('#p1c' + i).append('<img src="img/cards/' + playerHand[i].name + '_of_' + playerHand[i].suit + '.png">');
    }
    for (i = 0; i < computerHand.length; i++) {
        $('#p2c' + i).append('<img src="img/cards/' + computerHand[i].name + '_of_' + computerHand[i].suit + '.png">');
    }
    for (j = 0; j < crib.length; j++) {
        $('#crib' + j).append('<img src="img/cards/' + crib[j].name + '_of_' + crib[j].suit + '.png">');
    }
    for (k = 0; k < cardsPlayed.length; k++) {
        $('#cp' + k).append('<img src="img/cards/' + cardsPlayed[k].name + '_of_' + cardsPlayed[k].suit + '.png">');

    }
    if (communityCard !== undefined) {
        $('#communitycard').append('<img src="img/cards/' + communityCard.name + '_of_' + communityCard.suit + '.png">');
    }
}



function drawScore() {
    drawPegs();
    $("#p2peg" + computerScore).attr('src', "img/BlueDot.gif");
    $("#p1peg" + playerScore).attr('src', "img/RedDot.gif");
    $('#p1score p').text("Player 1 score: " + playerScore);
    $('#p2score p').text("Player 2 score: " + computerScore);

}


function drawPegs() {
    $('#p1toprow').empty();
    $('#p2toprow').empty();
    $('#p1upmidrow').empty();
    $('#p2upmidrow').empty();
    $('#p1midrow').empty();
    $('#p2midrow').empty();
    $('#p1btrow').empty();
    $('#p2btrow').empty();
    for (i = 91; i < 121; i++) {
        $('#p1toprow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2toprow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 90; i > 60; i--) {
        $('#p1upmidrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2upmidrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 31; i < 61; i++) {
        $('#p1midrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2midrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
    for (i = 30; i > 0; i--) {
        $('#p1btrow').append('<img id="p1peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
        $('#p2btrow').append('<img id="p2peg' + i + '" "class="peghole" src="img/peghole.png" alt="">');
    }
}

function Card(value, name, suit, rank) {
    this.value = value;
    this.name = name;
    this.suit = suit;
    this.rank = rank;
}

function buildDeck() {
    this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    this.suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    var cards = [];

    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            if (n < 10) {
                cards.push(new Card(n + 1, this.names[n], this.suits[s], n + 1));
            } else {
                cards.push(new Card(10, this.names[n], this.suits[s], n + 1));
            }
        }
    }

    return cards;
}

function shuffle(array) {
    var numberOfCards = array.length,
        temp, randomCard;
    while (numberOfCards) {
        randomCard = Math.floor(Math.random() * numberOfCards--);
        temp = array[numberOfCards];
        array[numberOfCards] = array[randomCard];
        array[randomCard] = temp;
    }

    return array;
}

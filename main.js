var deck = {};
var turn;
var playerHand = [];
var computerHand = [];
var crib = [];
$(document).ready(function() {
    deck = buildDeck();
    shuffle(deck);
    drawPegs();
    resetBoard();
});

function gameSequence(state) {
    if(state=="pickPlayer"){
        //make board ready to select a dealer
        $('#deckspot').click(dealerSelector);
    } else if (state=="deal"){
        //make board ready to deal
        dealCards();
    } else if (state=="fillCrib"){
        //make board ready to fillCrib
        fillCrib();
    } else if (state == "pickCommunityCard"){
        //make board ready to pickCommunityCard
        pickCommunityCard();
    } else if (state == "playerTurn"){
        playerTurn();
    }


}

function resetBoard() {
    deck = buildDeck();
    shuffle(deck);
    drawPegs();
    $('#deckspot').empty();
    $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
    gameSequence("pickPlayer");


}

function dealerSelector() {
    var computerCard = deck[Math.floor(Math.random() * 52)];
    console.log("computer selected " + computerCard.name + " of " + computerCard.suit);
    $('#deckspot').prepend('<img src="img/cards/' + computerCard.name + '_of_' + computerCard.suit + '.png">');
    $('#instruction').text("Computer has selected " + computerCard.name + ' of ' + computerCard.suit + ". Please click the deck to pick a card at random");
    var playerCard = deck[Math.floor(Math.random() * 52)];
    var text="";
    console.log("player selected " + playerCard.name + " of " + playerCard.suit);
    $('#deckspot').append('<img src="img/cards/' + playerCard.name + '_of_' + playerCard.suit + '.png">');
    if (playerCard.rank == computerCard.rank) {
        $('#instruction').text("You tied, players will have to choose again");
        setTimeout(resetBoard, 1000);
    } else if (playerCard.rank < computerCard.rank) {
        text = "You won, you are the dealer!";
        turn = "player";
    } else {
        text = "You lost, the computer is the dealer.";
        turn = "computer";
    }
    $('#deckspot').off('click');
    setTimeout(function(){
        $('#instruction').text(text);
        dealCards();
        fillCrib();
    }, 2000);

}

function dealCards() {
    $('#deckspot').empty();
    $('#deckspot').append('<img src="img/cards/back-of-deck.png" alt="">');
    for (i = 0; i < 6; i++) {
        playerHand.push(deck[0]);
        deck.shift();
        $('#p1c' + i).append('<img src="img/cards/' + playerHand[i].name + '_of_' + playerHand[i].suit + '.png">');
        computerHand.push(deck[0]);
        deck.shift();
        $('#p2c' + i).append('<img src="img/cards/' + computerHand[i].name + '_of_' + computerHand[i].suit + '.png">');
    }
}

function fillCrib() {
    $('#instruction').text("Pick two cards to send to the crib.");
    var computerCrib0 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib0]);
    computerHand.splice(computerCrib0,1);
    var computerCrib1 = Math.floor(Math.random() * computerHand.length);
    crib.push(computerHand[computerCrib1]);
    computerHand.splice(computerCrib1,1);




    for (i = 0;i<playerHand.length;i++){
        $("#p1c"+i).click(sendToCrib);
    }
}
function sendToCrib(event){
    var id = event.target.parentElement.id;
    var cardPicked = id.substr(id.length - 1);
    crib.push(playerHand[cardPicked]);
    $(event.target).remove('img');
    if (crib.length == 4){
        for(j=0;j<crib.length;j++){
            $('#crib'+j).append('<img src="img/cards/' + crib[j].name + '_of_' + crib[j].suit + '.png">');
        }
        for (i = 0;i<playerHand.length;i++){
            $("#p1c"+i).off('click');
        }
    }
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


// $('#p1c0').append('<img src="img/cards/' + test[0].rank + '_of_' + test[0].suit +'.png">'); //this draws the target card

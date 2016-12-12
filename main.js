$(document).ready(function(){
    var deck = buildDeck();
    shuffle(deck);

});




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

function Card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}

function deck() {
    this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    var cards = [];

    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            if (n < 10){
                cards.push(new Card(n + 1, this.names[n], this.suits[s]));
        } else {
            cards.push(new Card(10, this.names[n], this.suits[s]));
        }
    }
    }
    // for (var i = 0; i < cards.length; i++){
    //     if (cards.names[i] == '10' || cards.names[i] == 'J' ||cards.names[i] == 'Q' || cards.names[i] == 'K'){
    //         cards.value[i] = 10;
    //     } else {
    //         cards.value[i] = parseInt(cards.names[i]);
    //     }
    // }
    return cards;
}

function shuffle(array) {
    var numberOfCards = array.length,
        temp, randomCard;

    // While there remain elements to shuffle…
    while (numberOfCards) {
        // Pick a remaining element…
        randomCard = Math.floor(Math.random() * numberOfCards--);
        // And swap it with the current element.
        temp = array[numberOfCards];
        array[numberOfCards] = array[randomCard];
        array[randomCard] = temp;
    }

    return array;
}

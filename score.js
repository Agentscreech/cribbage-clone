function scoreOfAKind(cards) { //might have trouble for the in play portion
    var names = [];
    for (i = 0; i < cards.length; i++) { //grabs the names of the cards to compare for pairs and puts it into a new array
        names.push(cards[i].name);
    }
    names.sort(function(a, b) { // sorts the numbers from smallest to largest
        return a - b;
    });
    var total = 0;
    for (i = 0; i < names.length; i++) {
        for (j = i; j < names.length; j++) {
            if (i != j) {
                if (names[i] == names[j]) {
                    total += 2;
                }
            }
        }
    }
    return total;
}

function score15s(cards) { // grabs binary position representation of 2 or more cards and then adds them, if they equal 15, then score 2 points, returning totall points.
    var points = 0;
    for (var combo = 1; combo <= 31; combo++) { //combo is 1 through 31 because 11111 in binary is 31 and we have 5 cards to represent.
        var sum = 0;
        for (var pos = 0; pos <= 4; pos++) {
            if (((combo >> pos) & 1) == 1) {
                sum += cards[pos]; //looks at each position and if there is a "card" there, if so, it totals them.  ex. you want to add card[0] and card[3].  That would look like 01001 positionally (index0 is furthest right, index4 is furthest left).  This is comparison combination is represented as 9 in decimal. For each postion, bitshift it right by 0,1,2, or 3.  If after you do that, if there is a 1 in the right most postion, take the index equal to the amount that you shifted of the card array.  In this case, 0 and 3.
            }
        }
        if (sum == 15) points += 2;
    }
    return points;
}

function scoreSequence(cards) {
    cards.sort(function(a, b) {
            return a.rank - b.rank;
        });
        for (var i = 0; i < cards.length - 1; i++) {
            if (cards[i].rank + 1 != cards[i + 1].rank) {
                return false;
            }
        }
        return true;
    }

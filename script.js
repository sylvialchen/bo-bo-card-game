console.log("connected!")
// 1. Pull in cards from API
// 2. Convert J-A to numbers
// 3. Create Game Logic

scoreCards = (x,y) => {
    if (x === y) {
        return ["pair x", x + 100];
    } else if ((x + y) >= 10) {
        let score = 10 * (x + y - 10) - 1;
        return [`artificial ${x + y - 10}`, score];
    } else if ((x + y) < 10) {
        let score = 10 * (x + y)
        return [`natural ${x + y}`, score];
    }
}

let hand1 = scoreCards(5,5)
let hand2 = scoreCards(2,2)

console.log(hand1)
compareHands = (hand1,hand2) => {
    if (hand1[1] > hand2[1]) {
        console.log("winner hand1");
    } else if(hand1[1] < hand2[1]) {
        console.log("winner hand2");
    }
}
compareHands (hand1,hand2);
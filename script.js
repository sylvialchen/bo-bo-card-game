/////////// GAME LOGIC - CALCULATING PAIRS OF CARDS
// Functions to calculate the value of a pair of cards. Scoring is calculated as 
// (1) Matching pairs of any kind are higher than any mixed set of cards.
// (2) Matching pair of Aces is the highest hand.
// When cards are not matching:
// (3) JQK = 10 & A = 1
// (4) Highest number is 9. (i.e., Ace + 9 = 0)
// (5) A Natural 9 beats an Artificial 9.
// To implement this, a scoring scale was created by multiplying the value by 10 
// and adjusting by (1) for type of hand/ set made.
// A Natural 5 scores as 50, whereas an Artificial 5 scores as 49.

scoreCards = (cardValueOnly1, cardValueOnly2) => {
    if (cardValueOnly1 === cardValueOnly2) {
        x = parseInt(adjustCardValuesPairs(cardValueOnly1));
        return [`pair ${cardValueOnly1}`, x + 100];
    } else {
        revisedValueCard1 = adjustCardOther(cardValueOnly1);
        revisedValueCard2 = adjustCardOther(cardValueOnly2);
        if ((revisedValueCard1 + revisedValueCard2) >= 10) {
            let score = 10 * (revisedValueCard1 + revisedValueCard2 - 10) - 1;
            return [`artificial ${revisedValueCard1 + revisedValueCard2 - 10}`, score];
        } else if ((revisedValueCard1 + revisedValueCard2) < 10) {
            let score = 10 * (revisedValueCard1 + revisedValueCard2)
            return [`natural ${revisedValueCard1 + revisedValueCard2}`, score];
        }
    }
}
// scoreCards returns an array [description of pair, value strictly used for scoring]
// Helper functions for scoreCards to adjust JQKA to numeric values based on whether the cards are matching

adjustCardValuesPairs = (x) => {
    if (x >= 2 && x <= 10) {
        return parseInt(x);
    } else {
        switch (x) {
            case "JACK":
                return 11;
                break;
            case "QUEEN":
                return 12;
                break;
            case "KING":
                return 13;
                break;
            case "ACE":
                return 14;
                break;
        }
    }
}

adjustCardOther = (x) => {
    if (x >= 2 && x <= 10) {
        return parseInt(x);
    } else {
        switch (x) {
            case "JACK":
            case "QUEEN":
            case "KING":
                return 10;
                break;
            case "ACE":
                return 1;
                break;
        }
    }
}

/////////// GAME LOGIC - CALCULATING PAIRS OF CARDS
// 1. Each player is given (4) cards, we must ensure that the top (2) cards are smaller than the bottom (2) cards

compareHands = (hand1, hand2) => {
    if (hand1[1] > hand2[1]) {
        console.log("invalid hand")
    } else if (hand1[1] < hand2[1]) {
        console.log("valid hand");
    }
}

// Connect API to new shuffled deck, deal cards, one card at a time until each person receives 4 cards.
const selectNewDeckURL = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

$("button").click("#startButton", selectNewDeck)

const drawCardsURL1 = "https://www.deckofcardsapi.com/api/deck/";
const drawCardsURL2 = "/draw/?count=1";
const dealtCardsforPlayer1 = [];
const dealtCardsforDealer = [];


function selectNewDeck(event) {
    event.preventDefault();
    dealtCardsforDealer.splice(0,dealtCardsforDealer.length);
    dealtCardsforPlayer1.splice(0,dealtCardsforPlayer1.length);
    $(".playerCards").empty();
    $.ajax(selectNewDeckURL).then(
        (data) => {
            deckId = (data.deck_id)
            for (i = 0; i < 8; i++) {
                if (i % 2 === 0)
                    $.ajax(drawCardsURL1 + deckId + drawCardsURL2).then(
                        (data) => {
                            dealtCardsforPlayer1.push(data.cards)
                            console.log(data)
                            const addLi = document.createElement("li");
                            const addPic = document.createElement("img");
                            addPic.src = (data.cards[0].image);
                            $("ul.playerCards").append(addLi).append(addPic);
                        },
                        (error) => {
                            console.log('webrokeithere')
                            return;
                        })
                else {
                    $.ajax(drawCardsURL1 + deckId + drawCardsURL2).then(
                        (data) => {
                            dealtCardsforDealer.push(data.cards)
                        },
                        (error) => {
                            console.log('webrokeittthere')
                            return;
                        })
                }
            }
        },
        (error) => {
            console.log('webrokeiteverywhere')
        }
    )
}


// const card1 = {
//     "image": "https://www.deckofcardsapi.com/static/img/KH.png",
//     "value": "4",
//     "suit": "HEARTS",
//     "code": "KH"
// }
// const card2 = {
//     "image": "https://www.deckofcardsapi.com/static/img/8C.png",
//     "value": "3",
//     "suit": "CLUBS",
//     "code": "8C"
// }
// let hand1 = scoreCards(card1.value, card2.value);
// let hand2 = scoreCards("3", "3");

// console.log(hand1, hand2)
// compareHands(hand1, hand2);

console.log("connected!")

// function allowDrop(ev) {
//     ev.preventDefault();
//   }
  
//   function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
//   }
  
//   function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     ev.target.appendChild(document.getElementById(data));
//   }


$("ul").on("touchstart", "img", function (evt) {
    console.log("start")
});

$("ul").on("touchmove", "img", function (evt) {
    console.log("move")

});

$("ul").on("touchend", "img", function (evt) {
    console.log(evt)


});
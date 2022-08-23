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
    } if ((revisedValueCard1 + revisedValueCard2) >= 20) {
        let score = 10 * (revisedValueCard1 + revisedValueCard2 - 20);
        return [`artificial ${revisedValueCard1 + revisedValueCard2 - 20}`, score];
    } else if ((revisedValueCard1 + revisedValueCard2) >= 10) {
        let score = 10 * (revisedValueCard1 + revisedValueCard2 - 10) - 1;
        return [`artificial ${revisedValueCard1 + revisedValueCard2 - 10}`, score];
    } else if ((revisedValueCard1 + revisedValueCard2) < 10) {
        let score = 10 * (revisedValueCard1 + revisedValueCard2)
        return [`natural ${revisedValueCard1 + revisedValueCard2}`, score];
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
        return ("invalid")
    } else if (hand1[1] < hand2[1] || hand1[1] === hand2[1]) {
        return ("valid");
    }
}

/////////// Connect API to new shuffled deck, deal cards, one card at a time until each person receives 4 cards.
const selectNewDeckURL = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

$("#startButton").click("button", selectNewDeck)

const drawCardsURL1 = "https://www.deckofcardsapi.com/api/deck/";
const drawCardsURL2 = "/draw/?count=1";
const dealtCardsforPlayer1 = [];
const dealtCardsforDealer = [];


function selectNewDeck(event) {
    event.preventDefault();
    dealtCardsforDealer.splice(0, dealtCardsforDealer.length);
    dealtCardsforPlayer1.splice(0, dealtCardsforPlayer1.length);
    $(".playerCards").remove();
    $("li").remove();
    $(".handFeedback").text = "";
    $.ajax(selectNewDeckURL).then(
        (data) => {
            deckId = (data.deck_id)
            for (i = 0; i < 8; i++) {
                if (i % 2 === 0)
                    $.ajax(drawCardsURL1 + deckId + drawCardsURL2).then(
                        (data) => {
                            dealtCardsforPlayer1.push(data.cards)
                            const addLi = document.createElement("li");
                            const addPic = document.createElement("img");
                            addPic.setAttribute("class", "playerCards")
                            addPic.src = (data.cards[0].image);
                            $("ul.currentPlayerCards").append(addLi).append(addPic);
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
            //            console.log(dealtCardsforPlayer1);
        },
        (error) => {
            console.log('webrokeiteverywhere')
        }
    )
}
/////////// MAKE CARDS MOVEABLE ON MOBILE ONLY
// Player needs to choose how they will arrange the cards.
// **** CODE FROM WWW.HORUSKOL.NET
// **** https://www.horuskol.net/blog/2020-08-15/drag-and-drop-elements-on-touch-devices/

let moving = null;

$("body").on("touchstart", "img", function (event) {
    moving = event.target;
});

$("body").on("touchmove", "img", function (event) {
});

$("body").on("touchend", "img", function (event) {
    if (moving) {
        if (event.currentTarget.tagName !== 'HTML') {
            let target = null;
            if (event.clientX) {
                target = document.elementFromPoint(event.clientX, event.clientY);
            } else {
                target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            }
            target.appendChild(moving);
        }
        moving = null;
    }
});


/////////// SET CARDS BASED ON USER ARRANGEMENT

$("#setHand").click("#button", calculateHand)


function calculateHand(event) {
    event.preventDefault();
    // Match Pictures of cards to Card Objects
    // newLayoutOfCards is an ARRAY of IMAGES
    // dealtCardsforPlayers is am ARRAY of CARDS
    // each CARD is an ARRAY with ONE OBJECT
    const newLayoutOfCards = $(".playerCards");
    for (i = 0; i < newLayoutOfCards.length; i++)
        for (j = 0; j < dealtCardsforPlayer1.length; j++)
            if (newLayoutOfCards[i].src === dealtCardsforPlayer1[j][0].image) {
                newLayoutOfCards[i] = dealtCardsforPlayer1[j][0]
            }
    topHandScore = scoreCards(newLayoutOfCards[0].value, newLayoutOfCards[1].value);
    bottomHandScore = scoreCards(newLayoutOfCards[2].value, newLayoutOfCards[3].value);
    if (compareHands(topHandScore, bottomHandScore) === "valid") {
        $(".handFeedback").text(`Top: ${topHandScore[0]}, Bottom: ${bottomHandScore[0]}`);
    } else if (compareHands(topHandScore, bottomHandScore) === "invalid") {
        $(".handFeedback").text("Invalid hand, try again");
    }
}

/////////// SET DEALER'S HAND
// 1. Calculate all (6) scenarios
// 2. Add Scores, select scenario with the highest total score.

const scenarios = []

runScenario = (a, b, c, d) => {
    topHandScore = scoreCards(a.value, b.value);
    bottomHandScore = scoreCards(c.value, d.value);
    if (compareHands(topHandScore, bottomHandScore) === "valid") {
        return topHandScore[1] + bottomHandScore[1];
    } else if (compareHands(topHandScore, bottomHandScore) === "invalid") {
        return "Invalid";
    }
}

identifyHighestScore = () => {
    for (i = 0; i < scenarios.length; i++) 
        if(scenarios[i] === "Invalid"){
            scenarios[i] = -10;
        }
    for (i = 0; i < scenarios.length; i++) 
        if(scenarios[i] > scenarios[i+1]){
            highestScore = scenarios[i];
            index = i;
            return highestScore;
        }
    };

selectDealerScenario = () => {
    scenarios[0] = runScenario(dealtCardsforDealer[0][0], dealtCardsforDealer[1][0], dealtCardsforDealer[3][0], dealtCardsforDealer[3][0])
    scenarios[1] = runScenario(dealtCardsforDealer[0][0], dealtCardsforDealer[2][0], dealtCardsforDealer[3][0], dealtCardsforDealer[1][0])
    scenarios[2] = runScenario(dealtCardsforDealer[0][0], dealtCardsforDealer[3][0], dealtCardsforDealer[2][0], dealtCardsforDealer[1][0])
    scenarios[3] = runScenario(dealtCardsforDealer[1][0], dealtCardsforDealer[2][0], dealtCardsforDealer[0][0], dealtCardsforDealer[3][0])
    scenarios[4] = runScenario(dealtCardsforDealer[1][0], dealtCardsforDealer[3][0], dealtCardsforDealer[0][0], dealtCardsforDealer[2][0])
    scenarios[5] = runScenario(dealtCardsforDealer[2][0], dealtCardsforDealer[3][0], dealtCardsforDealer[0][0], dealtCardsforDealer[1][0])
    console.log(scenarios)
    highestDealerScore = identifyHighestScore(scenarios);
    scenarioWithHighestScore = scenarios.findIndex((scenario) => scenario === highestDealerScore)
    return (`scenario${scenarioWithHighestScore}`)
}

/////////// DISPLAY DEALER'S HAND



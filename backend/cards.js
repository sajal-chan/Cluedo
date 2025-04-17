//----------------------------------------------------CREATING THE DECK-------------------------------------------------------
const suspects = ["Miss Scarlet", "Colonel Mustard", "Mrs. Peacock", "Mr. Green", "Professor Plum", "Dr. Orchid"];
const weapons = ["Knife", "Revolver", "Rope", "Candlestick", "Wrench", "Lead Pipe"];
const locations = ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Lounge", "Hall", "Study", "Library", "Billiard Room"];

//-------------------------------------------------PICKING THE ANSWER CARDS-----------------------------------------------
function randomCardPicker(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck.splice(randomIndex, 1)[0];
}

const solution = {
  culprit: randomCardPicker(suspects),//creating shallow copies of the array
  weapon: randomCardPicker(weapons),
  location: randomCardPicker(locations),
};

console.log("solutions:", solution);

//------------------------------------------------ALLOTING CARDS TO THE PLAYERS----------------------------------------------------



function shuffle(deck){
    for(let i=0;i<deck.length;i++){
        const j=Math.floor(Math.random()*(i+1));
        [deck[i],deck[j]]=[deck[j],deck[i]];
    }
}

shuffle(suspects);
shuffle(weapons);
shuffle(locations);

function distributeCards(players,deck){
    const hands=Array.from({length:players},()=>[]);
    let playerIndex=0;
    
    while(deck.length>0){
      hands[playerIndex].push(deck.pop());
    }
    return hands;
}

const players=4;
//creating a 2-d array of[No_player][3]-->player,3 types of card
const playerHands=Arrays.from({length:players},()=>
                  Arrays.from({length:3},()=>[]));

console.log("player Hands",playerHands);
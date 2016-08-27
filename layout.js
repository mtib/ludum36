const DRALAIR = "dragons lair"


var pics = {
  "hello": "[ HELLO ]",
  "dragons lair": "It looks like <b class='place'>a dragons lair</b>",
}

function character() {
  this.name = "Unknown Unknown"
  this.show = "an unknown person"
  this.show_class = "person"
}

function tile(img="", items=[], chars=[], events=[]){
  this.image_name = img
  this.items = items
  this.characters = chars
  this.events = events
}

/*

tt t
t tt
ttt
  tt

*/

const NORTH = [-1, 0, "NORTH"]
const EAST  = [ 0,+1, "EAST"]
const SOUTH = [+1, 0, "SOUTH"]
const WEST  = [0, -1, "WEST"]

var endboss = new character()
endboss.name = "Red Dragon"
endboss.show = "a gigantic red dragon"
endboss.show_class = "enemy"

var map = [
  [
    new tile(), new tile(), 0, new tile(DRALAIR, [], [endboss])
  ],

  [
    new tile("", [], [new character()]), 0, new tile(), new tile()
  ],

  [
    new tile(), new tile(), new tile(), 0
  ],

  [
    new tile(), new tile(), new tile(), new tile()
  ],

  [
    0, 0, new tile(), new tile()
  ]
]

for (let y=0; y<map.length; y++) {
  for (let x=0; x<map[y].length; x++) {
    map[y][x].x = x
    map[y][x].y = y
  }
}

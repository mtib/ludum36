const DRALAIR = "dragons lair"


var pics = {
  "hello": "[ HELLO ]",
  "dragons lair": "It looks like <b class='place'>a dragons lair</b>",
  "hill": "You are standing on a small hill",
  "grassland": "You see grassy plains all around you",
  "cave": "You are in a cave",
  "caveentrance": "You stand in front of a cave",
  "river": "A small river is running by",
  "lake": "You find yourself at the coast of a lake",
  "mountain": "You are standing at the feet of a mountain",
  "desert": "Vegetation around here is dying",
}

function character() {
  this.name = "Person McPersonson"
  this.show = "a person"
  this.show_class = "person"
  this.health = 20
  this.attack = function(who) {
    who.health -= 4
    appendln(this.name + " takes a swing at you")
  }
}

function stylized(obj) {
  return "<b class='"+obj.show_class+"'>" + obj.show + "</b>"
}

function tile(img="", items=[], chars=[], events=[]){
  this.image_name = img
  this.items = items
  this.characters = chars
  this.events = events
}

function sheep() {
  this.char = new character()
  this.show = "a sheep"
  this.name = "Sheep Sheep"
  this.show_class = "animal"
}

function sword() {
  this.show = "a sword"
  this.name = "sword"
  this.attack = 12
  this.show_class = "item weapon"
  this.use = function(user) {
    user.weapon_name = this.name
    user.weapon_damage = this.attack
  }
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
    new tile("hello", [], [new sheep()]), new tile("hill"), 0, new tile(DRALAIR, [], [endboss])
  ],

  [
    new tile("river", [new sword()], [new character(), new sheep()]), 0, new tile("caveentrance"), new tile("cave")
  ],

  [
    new tile("grassland"), new tile("desert"), new tile("mountains"), 0
  ],

  [
    new tile("lake"), new tile("grassland"), new tile("grassland"), new tile("lake")
  ],

  [
    0, 0, new tile("lake"), new tile("lake")
  ]
]

for (let y=0; y<map.length; y++) {
  for (let x=0; x<map[y].length; x++) {
    map[y][x].x = x
    map[y][x].y = y
  }
}

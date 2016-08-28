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

function first_name() {
  p = ["Markus", "Lucas", "Ida", "Michael", "Kilian", "Aileen", "Gabriele", "Horst", "Christine"]
  return p[Math.floor(Math.random()*p.length)]
}

function last_name() {
  p = ["Becker", "Falch", "Schreiber", "Müller", "Meier", "Snow", "Miller"]
  return p[Math.floor(Math.random()*p.length)]
}

function character() {
  this.name = first_name() + " " + last_name()
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

function tile(img="", items=[], chars=[], events=[], map_char="_"){
  this.image_name = img
  this.items = items
  this.characters = chars
  this.events = events
  this.map_char = map_char
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

function healing_potion() {
  this.show = "a red potion"
  this.name = "healing potion"
  this.show_class = "item"
  this.use = function(user) {
    let value = Math.floor(Math.random()*5+1)
    user.max_health += value
    user.health += value
    appendln("Your maximum health rises by "+ value+"HP")
  }
}

function shrink_potion() {
  this.show = "a green potion"
  this.name = "shrink potion"
  this.show_class = "item"
  this.use = function(user) {
    appendln("You and your weapon shrink: 1/2 DMG")
    user.weapon_name = "tiny " + user.weapon_name
    user.weapon_damage /= 2
  }
}

function armor() {
  this.value = Math.floor(Math.random()*9+2)
  if (this.value < 4) {
    this.show = "a leather armor"
  } else if (this.value < 7) {
    this.show = "a chainmail"
  } else {
    this.show = "a plate armor"
  }
  this.show_class = "item"
  this.name = "armor"
  this.use = function(user) {
    user.health = user.max_health + this.value
    appendln("You gain " + this.value + " armor points")
  }
}

function corpse(item) {
  this.item = item
  this.show = "a corpse"
  this.name = "dead warrior"
  this.show_class = "person"
  this.use = function(user) {
    appendln("You search the body and find:")
    appendln(" - " + highlight(item))
  }
}

function bow() {
  this.show = "a nice bow"
  this.name = "oathbow"
  this.show_class = "item weapon"
  this.use = function(user) {
    user.weapon_name = this.name
    user.weapon_damage = Math.floor(Math.random(6)+10)
    appendln("You find " + highlight(this))
    appendln("and a couple of arrows")
  }
}

function rat() {
  this.show = "a giant rat"
  this.name = "giant rat"
  this.show_class = "enemy"
  this.attack = function(who) {
    who.health -= Math.floor(Math.random()*5+1)
    appendln("the "+ this.name + " bites you")
  }
}

function map_item() {
  // only works if map is rectangular
  this.show = "a scroll"
  this.name = "map"
  this.show_class = "item"
  this.use = function(user) {
    mps = ""
    for (y = 0; y < map.length; y++) {
      for (x = 0; x < map[0].length; x++) {
        if (map[y][x] != 0) {
          mps += "[" + map[y][x].map_char + "]"
        } else {
          mps += "   "
        }
      }
      mps += '\n'
    }
    appendln("You find a MAP")
    appendln(mps)
    user.map = this
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
endboss.health = 40
endboss.pos = [
  function(who) {
    // breathe fire
    who.health -= rint(2,5)
    appendln("the Dragon breathes fire")
  },
  function(who) {
    // use claws
    who.health -= rint(1,3)
    appendln("the Dragon uses its claws")
  },
  function(who) {
    // use tail
    appendln("the dragon spins around")
    v = rint(0,4)
    if (v!=0){
      appendln("and hits you with its tail")
      who.health -= rint(0,2)
    } else {
      appendln("and misses")
    }
  },
]
endboss.attack = function(who) {
  t = rint(0, endboss.pos.length)
  endboss.pos[t](who)
}

var map = [
  [
    new tile("hello", [], [new sheep()], [function(){appendln("You have heard of a great danger in the east")}], "s"), new tile("hill", [new map_item()], [], [], "x"), 0, new tile(DRALAIR, [], [endboss], [function(co){appendln("Fire surrounds you -2HP"); co.health-=2; setTimeout(co.check, 2000)}], "D")
  ],

  [
    new tile("river", [new sword()], [new character(), new sheep()], [], "r"), 0, new tile("caveentrance", [], [], [], "c"), new tile("cave", [new corpse(new bow())], [new rat()], [], "c")
  ],

  [
    new tile("grassland", [new healing_potion()], [], [], "g"), new tile("desert", [new shrink_potion], [],[], "d"), new tile("mountain", [],[],[],"m"), 0
  ],

  [
    new tile("lake", [new armor()], [],[],"l"), new tile("grassland", [],[],[],"g"), new tile("grassland", [],[],[],"g"), new tile("lake", [],[],[],"l")
  ],

  [
    0, 0, new tile("lake", [],[],[],"l"), new tile("lake", [new healing_potion()],[],[],"l")
  ]
]

for (let y=0; y<map.length; y++) {
  for (let x=0; x<map[y].length; x++) {
    map[y][x].x = x
    map[y][x].y = y
  }
}

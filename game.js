var pic = document.getElementById("picture")
var ans = document.getElementById("answer")
var inp = document.getElementById("input")
var hist_lookup = []
var hist_curr = 0

let call_obj = {
  current: function(){},
  x: 0,
  y: 0,
  move: function(direction) {
    nx = call_obj.x + direction[1]
    ny = call_obj.y + direction[0]
    if (!(ny < 0 || nx < 0 || map.length <= ny || map[ny].length <= nx || map[ny][nx] == 0)) {
      pic.innerHTML = ""
      ans.innerHTML = ""
      for (let event in map[nx][ny].events) {
        event()
      }
      call_obj.x = nx
      call_obj.y = ny
    } else {
      answer(
        call_obj.excuses[
          Math.floor(Math.random()*call_obj.excuses.length)
        ](direction)
      )
    }
    mo = map[call_obj.y][call_obj.x]
    console.log(mo)
    call_obj.draw()
    call_obj.current_tile = mo
  },
  draw: function() {
    if (mo.image_name != "") {
      load_pic(mo.image_name)
      pic.innerHTML += "\n"
    }
    for (let char in mo.characters) {
      let c = mo.characters[char]
      pic.innerHTML += "you see <b class='"+ c.show_class +"'>" + c.show + "</b>\n"
    }
    for (let item in mo.items) {
      let i = mo.items[item]
      pic.innerHTML += "you can see <b class='"+i.show_class+"'>" + i.show + "</b> " + call_obj.wheres()
    }
  },
  excuses: [
    function(dir) {return "You ran into a wall going " + dir[2]},
    function(dir) {return "Trying to go " + dir[2] + " you got turned around"},
    function(dir) {return "You don't find a way leading " + dir[2]},
  ],
  wheres: function() {
    pos = [
      "on the ground",
      "in a tree",
      "in a stone"
    ]
    return pos[Math.floor(Math.random()*pos.length)]
  },
  current_tile: 0,
  weapon_name: "fists",
  weapon_damage: 3,
  max_health: 10,
  health: 10,
  check: function() {
    if (call_obj.health <= 0) {
      answer("Your health reached 0HP.")
      appendln(". . . here ends your adventure")
      appendln("\nRELOAD the page to start again")
      inp.removeEventListener("keyup", keyup)
      return 0
    }
    return 1
  },
  redraw: function() {
    pic.innerHTML = ""
    call_obj.draw()
  },
}
call_obj.current_tile = map[call_obj.y][call_obj.x]

function load_pic(name) {
  if (name in pics) {
    pic.innerHTML = pics[name]
  } else {
    console.log("unknown pic: " + name)
  }
}

function highlight(text) {
  s = text.split(" ")
  for (i in s) {
    if (s[i].length > 1 && s[i][0] != "\"" && s[i].toUpperCase() == s[i]) {
      if (valin(s[i][s[i].length-1], ".,:;!")) {
        s[i] = "<b class='command'>" + s[i].slice(0,-1) + "</b>" + s[i].slice(-1)
      } else {
        s[i] = "<b class='command'>" + s[i] + "</b>"
      }
    }
  }
  return s.join(" ")
}

function answer(text) {
  ans.innerHTML = highlight(text)
}

function append(text) {
  ans.innerHTML += highlight(text)
}

function appendln(text){
  if (!ans.innerHTML[ans.innerHTML.length-1] == '\n') {
    ans.innerHTML += '\n'
  }
  ans.innerHTML += highlight(text)
}

function echo(text) {
  answer(text)
}

function handle(text) {
  switch (text) {
  case "27e":
    call_obj.move([0, +3, "27e"])
    return
  }
  spl = text.split(" ")
  switch (spl[spl.length-1]) {
  case "north":
    call_obj.move(NORTH)
    return
  case "east":
    call_obj.move(EAST)
    return
  case "south":
    call_obj.move(SOUTH)
    return
  case "west":
    call_obj.move(WEST)
    return
  }

  if (text == "help") {
    answer("Use NORTH, EAST, SOUTH, WEST to move around")
    appendln("Use PICK UP, TAKE to get stuff")
    appendln("Use ATTACK, HURT, KILL to attempt to attack")
    return
  }

  if (valin("look", spl)) {
    answer("You start looking around")
    return
  }

  if (gvalin(["sleep", "rest", "nap"], spl)){
    hprecov = Math.min(Math.floor(Math.random()*(call_obj.max_health/2)), call_obj.max_health-call_obj.health)
    call_obj.health += hprecov
    answer("you rest for a bit . . .")
    appendln("you regenerate " + hprecov + "HP")
    return
  }

  function fmin(dic) {
    let min = 1e10
    let min_index = -1
    let x = 0
    for (r in dic) {
      if (dic[r] < min) {
        min = dic[r]
        min_index = x
      }
      x++
    }
    return min_index
  }

  if (gvalin(["take", "pick", "get"], spl)) {
    while (valin(spl[0], ["take", "pick", "up", "get"])) {
      spl.shift()
    }
    if (spl[spl.length-1] == "up") {
      spl.pop()
    }
    if (spl.length == 0) {
      appendln("what?")
      return
    }
    let rates = fuzzy(spl.join(" "), call_obj.current_tile.items.map(function(obj){return obj.show}))
    let min_index = fmin(rates)
    if (rates[min_index] > 4) {
      appendln("I don't know how to do that")
    }
    appendln("you pick "+stylized(call_obj.current_tile.items[min_index])+" up")
    call_obj.current_tile.items[min_index].use(call_obj)
    call_obj.current_tile.items.splice(min_index,1)
    call_obj.redraw()
    return
  }

  if (valin(text, ["me", "items", "inventory", "myself", "self"])) {
    // TODO print info
  }

  if (gvalin(["kill", "attack", "hurt"], spl)) {
    while (valin(spl[0], ["kill", "attack", "hurt"])) {
      spl.shift()
    }
    if (valin(spl.slice(-1), ["me", "myself", "i", "self"])) {
      appendln(". . . what a way to go.")
      appendln("you start ripping your organs out like a madman")
      call_obj.health = 0
      setTimeout(call_obj.check, 3000)
      return
    }
    let rates = fuzzy(spl.join(" "), call_obj.current_tile.characters.map(function(obj){return obj.show}))
    let min_index = fmin(rates)
    if (rates[min_index] > 4) {
      appendln("I don't know how to do that")
    }
    if (min_index != -1) {
      target = call_obj.current_tile.characters[min_index]
      appendln("You attack " + target.show + " with your " + call_obj.weapon_name)
      if (target.health != undefined) {
        target.health -= call_obj.weapon_damage
        if (target.health <= 0) {
          appendln("You killed " + target.show)
          call_obj.current_tile.characters.splice(min_index, 1)
        } else if (target.attack != undefined){
          target.attack(call_obj)
          let alive = call_obj.check()
          if (alive) {
            appendln("You have "+ call_obj.health + "HP left")
          }
        }
      } else {
        appendln("You killed " + target.show)
        call_obj.current_tile.characters.splice(min_index, 1)
      }
    }
    call_obj.redraw()
    return
  }

  appendln("I do not know how to \"{0}\"".format(text))
  return
}

function keyup(event) {
  switch (event.keyCode) {
  case 13:
    hist_curr=0
    enter()
    break
  case 27:
    hist_curr=0
    inp.value=""
    break
  case 38:
    if (hist_curr < hist_lookup.length) {
      console.log("up")
      inp.value = hist_lookup[hist_curr]
      hist_curr+=1
    }
    break
  case 40:
    if (hist_curr > 0) {
      hist_curr -= 1
      inp.value = hist_lookup[hist_curr]
    } else {
      inp.value = ""
    }
    break
  default:
    //console.log(event.keyCode)
    // nothing
    // maybe fuzzy complete?
  }
}

function enter() {
  let input = inp.value.trim().toLowerCase()
  if (input == "") {
    return
  }
  inp.value = ""
  console.log(hist_lookup)
  if (hist_lookup.length != 0) {
    if (input != hist_lookup[0]){
      hist_lookup.unshift(input)
    }
  } else {
    hist_lookup.unshift(input)
  }
  call_obj.current(input)
}

// Initial Setup
{
  function start_game() {
    call_obj.move([0,0,"START"])
    inp.removeEventListener("click", start_game)
  }
  inp.addEventListener("keyup", keyup)
  inp.addEventListener("click", start_game)
  call_obj.current=handle
  load_pic("hello")
  answer("type HELP for help")
}

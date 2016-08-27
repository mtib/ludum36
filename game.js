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
    if (mo.image_name != "") {
      load_pic(mo.image_name)
      pic.innerHTML += "\n"
    }
    for (let char in mo.characters) {
      let c = mo.characters[char]
      pic.innerHTML += "you see <b class='"+ c.show_class +"'>" + c.show + "</b>\n"
    }
    call_obj.current_tile = mo
  },
  excuses: [
    function(dir) {return "You ran into a wall going " + dir[2]},
    function(dir) {return "Trying to go " + dir[2] + " you got turned around"},
    function(dir) {return "You don't find a way leading " + dir[2]},
  ],
  current_tile: 0,
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
  switch (spl[spl.length-1].toLowerCase()) {
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

  if (text.toLowerCase() == "help") {
    answer("Use NORTH, EAST, SOUTH, WEST to move around")
    appendln("Use PICK UP, TAKE to get stuff")
    appendln("Use ATTACK, HURT, KILL to attempt to attack")
    return
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
    appendln("you want to pick "+spl.join(" ")+" up, don't you?")
    return
  }

  if (gvalin(["kill", "attack", "hurt"], spl)) {
    while (valin(spl[0], ["kill", "attack", "hurt"])) {
      spl.shift()
    }
    rates = fuzzy(spl.join(" "), call_obj.current_tile.characters.map(function(obj){return obj.show}))
    min = 1e10
    min_index = -1
    let x = 0
    for (r in rates) {
      if (rates[r] < min) {
        min = rates[r]
        min_index = x
      }
      x++
    }
    if (min_index != -1) {
      appendln("So you want to attack " + call_obj.current_tile.characters[min_index].show)
    }
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
      inp.value = hist_lookup[hist_curr++]
    }
  default:
    //console.log(event.keyCode)
    // nothing
    // maybe fuzzy complete?
  }
}

function enter() {
  let input = inp.value
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
  inp.addEventListener("keyup", keyup)
  call_obj.current=handle
  load_pic("hello")
  answer("type HELP for help")
}

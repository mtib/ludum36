var pic = document.getElementById("picture")
var ans = document.getElementById("answer")
var inp = document.getElementById("input")

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
  },
  excuses: [
    function(dir) {return "You ran into a wall going " + dir[2]},
    function(dir) {return "Trying to go " + dir[2] + " you got turned around"},
    function(dir) {return "You don't find a way leading " + dir[2]},
  ],
}

function load_pic(name) {
  if (name in pics) {
    pic.innerHTML = pics[name]
  } else {
    console.log("unknown pic: " + name)
  }
}

function answer(text) {
  ans.innerHTML = text
}

function append(text) {
  ans.innerHTML += text
}

function appendln(text){
  if (!ans.innerHTML[ans.innerHTML.length-1] == '\n') {
    ans.innerHTML += '\n'
  }
  ans.innerHTML += text
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
    break
  case "east":
    call_obj.move(EAST)
    break
  case "south":
    call_obj.move(SOUTH)
    break
  case "west":
    call_obj.move(WEST)
    break
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
  }

  appendln("I do not know how to \"{0}\"".format(text))
}

function keyup(event) {
  switch (event.keyCode) {
    case 13:
      enter()
      break
    case 27:
      inp.value=""
      break
    default:
      // nothing
      // maybe fuzzy complete?
  }
}

function enter() {
  let input = inp.value
  inp.value = ""
  call_obj.current(input)
}

// Initial Setup
{
  inp.addEventListener("keyup", keyup)
  call_obj.current=handle
  load_pic("hello")
  answer("type HELP for help")
}

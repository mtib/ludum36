var pic = document.getElementById("picture")
var ans = document.getElementById("answer")
var inp = document.getElementById("input")

let call_obj = {
  current: function(){}
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
  ans.innerHTML += "\n" + text
}

function echo(text) {
  answer(text)
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
  load_pic("hello")
  answer("type HELP for help")
}

// Debug
{
  call_obj.current = echo
}

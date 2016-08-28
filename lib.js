if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if (!Array.prototype.map)
{
   Array.prototype.map = function(fun /*, thisp*/)
   {
      var len = this.length;

      if (typeof fun != "function")
      throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[1];

      for (var i = 0; i < len; i++)
      {
         if (i in this)
         res[i] = fun.call(thisp, this[i], i, this);
      }
      return res;
   };
}

function valin(value, dictionary) {
  for (key in dictionary) {
    if (dictionary[key] == value) {
      return true
    }
  }
  return false
}

function gvalin(values, dictionary) {
  for (index in values) {
    if (valin(values[index], dictionary)) {
      return true
    }
  }
  return false
}

function fuzzy_rate(input, output) {
  matrix = []

  for (let y = 0; y <= input.length; y++) {
    matrix[y] = [y]
    for (let x = 0; x < output.length; x++) {
      if (y == 0) {
        matrix[y].push(x+1)
      } else {
        matrix[y].push(0)
      }
    }
  }
  for (let x = 1; x <= output.length; x++) {
    for (let y = 1; y <= input.length; y++) {
      let s = 1
      if (input[y-1] == output[x-1]) {
        s = 0
      }
      //console.log(x+","+y+" :: "+ (matrix[y][x-1] +1) + " or " + (matrix[y-1][x] + 1)+ " or " + (matrix[y-1][x-1] + s))
      matrix[y][x] = Math.min(
        matrix[y][x-1] + 1,
        matrix[y-1][x] + 1,
        matrix[y-1][x-1] + s
      )
    }
  }
  /*
  debug=""
  for (line in matrix) {
    if (line > 0)
      debug += input[line-1]
    else {
      debug = "\t\t"
      for (let c = 0; c < output.length; c++) {
        debug += output[c] + '\t'
      }
      debug += '\n'
    }
    debug += '\t'
    for (row in matrix[line]) {
      debug += matrix[line][row] + '\t'
    }
    debug += '\n'
  }
  console.log(debug)
  */
  return matrix[input.length-1][output.length-1]
}

function fuzzy(input, options) {
  result = {}
  for (let oi in options){
    result[options[oi]] = fuzzy_rate(input, options[oi])
  }
  return result
}

// [min;max)
function rint(min, max) {
  return Math.floor(Math.random()*(max-min)+min)
}

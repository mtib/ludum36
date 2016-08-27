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

var ajax = function (type, func, url, elem, data) {
  elem = elem || null;
  data = data || null;
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400)
      func(JSON.parse(xhr.responseText), elem, data)
    else
      console.error(xhr.statusText);
  };
  xhr.onerror = function () { console.error(xhr.statusText); };
  xhr.send();
};

var addClass = function(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

var removeClass = function(el, className) {
if (el.classList)
  el.classList.remove(className);
else
  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

var toggleClass = function(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);
    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);
    el.className = classes.join(' ');
  }
}

// Convert date to MM/DD/YYYY
var convertDate = function(date){
  var d = new Date(date);

  return (d === NaN) ? date : (d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear());
}
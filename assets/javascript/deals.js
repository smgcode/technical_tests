var API_URL = "http://www.westfield.com.au/api/";
var STATE_URL = "centre/master/centres.json?state=";
var ALL_CENTRES_URL = "centre/master/centres.json?country=au&retail=true&enabled=true";
var CENTRE_URL = "deal/master/deals.json?centre=";
var PUB_URL    = "&state=published";
var STORE_URL  = "store/master/stores/";

var buildCentres = function (resp, el) {
  resp.forEach(function(centre, index) {
    var centreTemplate = new EJS({ url: "assets/templates/centres.ejs" }).render({
      state:      centre.state,
      short_name: centre.short_name,
      code:       centre.code,
      first:     (index == 0)
    });
    el.insertAdjacentHTML('beforeend', centreTemplate);
  });
}

var buildDeal = function(resp, el, data) {
  var dealTemplate = new EJS({ url: "assets/templates/deals.ejs" }).render({
    deal:           data.title,
    available_from: convertDate(data.available_from),
    available_to:   convertDate(data.available_to),
    store:          resp.name,
    image:          resp._links.logo.href
  });
  el.insertAdjacentHTML('beforeend', dealTemplate);
}

var buildDealNav = function(resp, el) {
  resp.forEach(function(state, index) {
    var navTemplate = new EJS({ url: "assets/templates/deals_nav.ejs" }).render({
      state: state,
      first: (index == 0)
    });
    el.insertAdjacentHTML('beforeend', navTemplate);
  });
};

var buildDealAccordion = function(resp, el) {
  resp.forEach(function(state) {
    var accordionTemplate = new EJS({ url: "assets/templates/deals_accordion.ejs" }).render({
      state: state
    });
    el.insertAdjacentHTML('beforeend', accordionTemplate);
  });
};

var buildNoDeals = function(el) {
  var noDealTemplate = new EJS({ url: "assets/templates/no_deals.ejs" }).render();
  el.insertAdjacentHTML('beforeend', noDealTemplate);
};

var getCentres = function(resp) {
  var el = document.getElementById(resp[0].state + "-centres");
  buildCentres(resp, el);
  listenToCentres(resp, el);
  getCentresDeals(el.firstChild);
};

var getCentresDeals = function(el) {
  if (!el.querySelectorAll("ul:first-of-type")[0].hasChildNodes())
    ajax('GET', getDeals, API_URL + CENTRE_URL + el.id + PUB_URL, el.querySelector("ul:first-of-type"));
};

var getDeals = function(resp, el) {
  if (resp.length == 0) return buildNoDeals(el);
  resp.forEach(function(data) {
    ajax('GET', buildDeal, API_URL + STORE_URL + data.deal_stores[0].store_service_id, el, data);
  });
};

var getStates = function(resp) {
  var el = document.getElementById("states");
  var states = getValidStates(resp);

  buildDealNav(states, el);
  buildDealAccordion(states, document.getElementById("deal-accordion"));
  listenToStates(states, el);
  getStatesCentres(el.firstChild.innerHTML, states[0])
};

var getStatesCentres = function(el, state) {
  if (!document.getElementById(state + "-centres").hasChildNodes())
    ajax('GET', getCentres, API_URL + STATE_URL + el);
};

var getValidStates = function(resp) {
  var states = [];

  resp.forEach(function(data) {
    if (states.indexOf(data.state) == -1)
      states.push(data.state)
  });
  return states;
};

var listenToCentres = function(resp, el) {
  resp.forEach( function(centre, index) {
    var dealEl = el.children[index];
    dealEl.querySelectorAll('p')[0].addEventListener("click", function() {
      switchCentre(resp, centre);
      getCentresDeals(dealEl);
    });
  });
};

var listenToStates = function(resp, el) {
  resp.forEach(function(state, index) {
    var stateEl = el.children[index];
    stateEl.addEventListener("click", function() {
      switchState(resp, state, el, stateEl);
      getStatesCentres(stateEl.innerHTML, state);
    });
  });
};

var switchCentre = function(resp, centre) {
  resp.forEach( function(curCentre) {
    var centreEl = document.getElementById(curCentre.code);
    var dealsEl = centreEl.querySelectorAll("ul:first-of-type")[0];
    var activeCentreEl = centreEl.querySelectorAll("p i")[0];
    if (centreEl.id != centre.code) {
      addClass(dealsEl, "accordion__section--hide");
      addClass(activeCentreEl, "fa-plus");
    } else {
      toggleClass(dealsEl, "accordion__section--hide");
      toggleClass(activeCentreEl, "fa-plus");
      toggleClass(activeCentreEl, "fa-minus");
      toggleClass(centreEl, "accordion__section--select");
    }
  });
};

var switchState = function(resp, state, tabsEl, selectedTabEl) {
  console.log(tabsEl);
  resp.forEach(function(curState, index) {
    var stateEl = document.getElementById(curState + "-centres");
    var stateNavEl = tabsEl.querySelectorAll("li:nth-child(" + (index + 1) + ")")[0];
    console.log(stateNavEl);
    removeClass(stateNavEl, "menu__tabs--selected");
    addClass(stateNavEl, "menu__tabs--unselected");
    stateEl.style.display = stateEl.id == state + "-centres" ? '' : 'none'
  });
  addClass(selectedTabEl, "menu__tabs--selected");
  removeClass(selectedTabEl, "menu__tabs--unselected");
};

ajax('GET', getStates, API_URL + ALL_CENTRES_URL);

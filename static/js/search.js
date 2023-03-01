var currentFocus;
SEARCH.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;
    if (!val) {
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for (i = 0; i < CITIES.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (
            CITIES[i].name.substr(0, val.length).toUpperCase() ==
            val.toUpperCase()
        ) {
            /*create a li element for each matching element:*/
            b = document.createElement("li");
            /*make the matching letters bold:*/
            b.innerHTML =
                "<strong>" + CITIES[i].name.substr(0, val.length) + "</strong>";
            b.innerHTML += CITIES[i].name.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML +=
                "<input type='hidden' value='" + CITIES[i].name + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                SEARCH.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});

/*execute a function presses a key on the keyboard:*/
SEARCH.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
        /*If the arrow DOWN key
      is pressed,
      increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == 38) {
        /*If the arrow UP key
      is pressed,
      decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
    }
    if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
    }
});

SEARCH.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        removeSuggestions();
        let location = SEARCH.value;
        if (location) {
            currentCity = location;
            getWeatherData(location, currentUnit, hourlyOrWeek);
        }
    }
});

// function to handle search form
SEARCH_FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = SEARCH.value;
    if (location) {
        currentCity = location;
        getWeatherData(location, currentUnit, hourlyOrWeek);
    }
});

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);
}
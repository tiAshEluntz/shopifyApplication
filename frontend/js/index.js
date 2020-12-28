function setUpSearch() {
    hideBoxes(true);
    let searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("keyup", () => {
        let searchWord = searchBox.value;
        if (searchWord === "") {
            hideBoxes(true);
        } else {
            handleSearch(searchWord);
        }
    });
}

function createElementHelper(elementName, attributes, nodeText) {
    nodeText = nodeText || "";
    attributes = attributes || [];

    var newElement = document.createElement(elementName);
    if (nodeText.length > 0) {
        newElement.innerText = nodeText;
    }
    for (var key in attributes) {
        var newAttribute = document.createAttribute(key);
        newAttribute.value = attributes[key];
        newElement.setAttributeNode(newAttribute);
    }
    return newElement;
}
const operations = {
    ADD: "add",
    REMOVE: "remove",
};

function handleSearch(word) {
    hideBoxes(false);
    let searchWord = document.getElementById("searchWord");
    searchWord.innerText = word;
    fetch("http://www.omdbapi.com/?apikey=96684add&s=" + word)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                let searchResult = data.Search;
                showResultCards(searchResult);
            } else {
                removeResultCards();
            }
        });
}

var nominees = [];

function showResultCards(searchResult) {
    removeResultCards();
    const cardGroup = document.getElementById("cardGroup");
    for (let i = 0; i < searchResult.length && i < 3; i++) {
        let cardElement = createCardElem(
            searchResult[i],
            "btn-success",
            "Nominate",
            operations.ADD
        );

        cardGroup.appendChild(cardElement);
        if (nominees.find((e) => e.imdbID === searchResult[i].imdbID)) {
            document.getElementById(
                searchResult[i].imdbID + operations.ADD
            ).disabled = true;
        }

        // Some logic here after
        document
            .getElementById(searchResult[i].imdbID + operations.ADD)
            .addEventListener("click", () => {
                if (nominees.length < 5 && !nominees.includes(searchResult[i])) {
                    nominees.push(searchResult[i]);
                    addNominee(searchResult[i]);
                    document.getElementById(
                        searchResult[i].imdbID + operations.ADD
                    ).disabled = true;
                    makeAlert(
                        "alert-success",
                        "You have " +
                        nominees.length +
                        " nomination(s). " +
                        (5 - nominees.length) +
                        " remaining."
                    );
                } else {
                    makeAlert("alert-danger", "You cannot have more than 5 nominations");
                }
            });
    }
}

function addNominee(movieObj) {
    let newCardElem = createCardElem(
        movieObj,
        "btn-danger",
        "Remove",
        operations.REMOVE
    );
    let parent = document.getElementById("nomGroup");
    parent.appendChild(newCardElem);
    newCardElem.addEventListener("click", () => {
        nominees = nominees.filter((e) => movieObj.imdbID !== e.imdbID);
        parent.removeChild(newCardElem);
        if (document.getElementById(movieObj.imdbID + operations.ADD) !== null) {
            document.getElementById(
                movieObj.imdbID + operations.ADD
            ).disabled = false;
        }
    });
}

function createCardElem(search, buttonClass, buttonText, opp) {
    let cardElem = createElementHelper("div", {
        class: "card text-justify",
        style: "margin-right:7px",
    });
    let imageElem = createElementHelper("img", {
        class: "card-img-top",
        src: search.Poster,
        alt: search.Title + " image",
    });
    let cardBodyElem = createElementHelper("div", {
        class: "card-body",
    });
    let cardTitle = createElementHelper(
        "h5", {
            class: "card-title",
        },
        search.Title
    );
    let cardText = createElementHelper(
        "p", {
            class: "card-text",
        },
        "Year: " + search.Year
    );
    let buttonElem;
    if (opp === operations.ADD) {
        buttonElem = createElementHelper(
            "button", {
                class: "btn " + buttonClass,
                id: search.imdbID + operations.ADD,
            },
            buttonText
        );
    }
    if (opp === operations.REMOVE) {
        buttonElem = createElementHelper(
            "button", {
                class: "btn " + buttonClass,
                id: search.imdbID + operations.REMOVE,
            },
            buttonText
        );
    }

    cardBodyElem.appendChild(cardTitle);
    cardBodyElem.appendChild(cardText);
    cardBodyElem.appendChild(buttonElem);
    cardElem.appendChild(imageElem);
    cardElem.appendChild(cardBodyElem);
    return cardElem;
}

function removeResultCards() {
    document.getElementById("cardGroup").innerHTML = "";
}

function makeAlert(htmlClass, message) {
    let alertElem = document.getElementById("messageAlert");
    alertElem.classList.add(htmlClass);
    alertElem.innerText = message;
    setTimeout(function () {
        alertElem.classList.remove(htmlClass);
        alertElem.innerText = "";
    }, 500);
}

function hideBoxes(value) {
    let resultBox = document.getElementById("resultBox");
    resultBox.hidden = value;
    let nominationBox = document.getElementById("nominationBox");
    nominationBox.hidden = value;
}
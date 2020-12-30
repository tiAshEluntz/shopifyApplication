const operations = {
    ADD: "add",
    REMOVE: "remove",
};
// created using UUID to keep the name unique
const storageKeys = {
    value: "55a7769c-4969-11eb-b378-0242ac130002",
}

var NOMINEELIST = [];
/**
 * Check if there are nominees in the local storage, also add the event listener on the check box
 */
function setUpSearch() {
    hideBoxes(true);
    if (localStorage.getItem(storageKeys.value) !== undefined) {
        let nominees = JSON.parse(localStorage.getItem(storageKeys.value));
        console.log(nominees)
        for (let i = 0; i < nominees.length; i++) {
            addNominee(nominees[i]);
        }
    }
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

/**
 * helper method to create html attributes easily
 * @param {string} elementName the name of the htlm element
 * @param {object} attributes the different attributes of the html element ex class, style etc.
 * @param {string} nodeText the inner html text if the element can display text
 */
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
/**
 * To fetch movie list from omdapi with the word written by the user
 * @param {string} word the word to send the api call with
 */
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
/**
 * To create the html elements on the page
 * @param {Array} searchResult the parsed result array received from an api call
 */
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
        if (NOMINEELIST.find((e) => e.imdbID === searchResult[i].imdbID)) {
            document.getElementById(
                searchResult[i].imdbID + operations.ADD
            ).disabled = true;
        }
        document
            .getElementById(searchResult[i].imdbID + operations.ADD)
            .addEventListener("click", () => {
                if (NOMINEELIST.length < 5 && !NOMINEELIST.includes(searchResult[i])) {
                    addNominee(searchResult[i]);
                    document.getElementById(
                        searchResult[i].imdbID + operations.ADD
                    ).disabled = true;
                    makeAlert(
                        "alert-success",
                        "You have " +
                        NOMINEELIST.length +
                        " nomination(s). " +
                        (5 - NOMINEELIST.length) +
                        " remaining."
                    );
                } else {
                    makeAlert("alert-danger", "You cannot have more than 5 nominations");
                }
            });
    }
}
/**
 * to parse and create nominee cards
 * @param {Object} movieObj the movie object received from an api call
 */
function addNominee(movieObj) {
    NOMINEELIST.push(movieObj);
    localStorage.setItem(storageKeys.value, JSON.stringify(NOMINEELIST));
    let newCardElem = createCardElem(
        movieObj,
        "btn-danger",
        "Remove",
        operations.REMOVE
    );
    let parent = document.getElementById("nomGroup");
    parent.appendChild(newCardElem);
    newCardElem.addEventListener("click", () => {
        NOMINEELIST = NOMINEELIST.filter((e) => movieObj.imdbID !== e.imdbID);
        localStorage.setItem(storageKeys.value, JSON.stringify(NOMINEELIST));
        parent.removeChild(newCardElem);
        if (document.getElementById(movieObj.imdbID + operations.ADD) !== null) {
            document.getElementById(
                movieObj.imdbID + operations.ADD
            ).disabled = false;
        }
    });
}
/**
 * 
 * @param {Object} search the movie object element
 * @param {string} buttonClass the bootstrap class type of the button
 * @param {string} buttonText the text displayed on the button
 * @param {string} opp from enum operation, represent either ADD or DELETE
 */
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
/**
 * To clear the search result area
 */
function removeResultCards() {
    document.getElementById("cardGroup").innerHTML = "";
}
/**
 * to dynamically creatte bootstrap alerts
 * @param {string} htmlClass the bootstrap class of the alert
 * @param {string} message the message to be displayed
 */
function makeAlert(htmlClass, message) {
    let alertElem = document.getElementById("messageAlert");
    alertElem.classList.add(htmlClass);
    alertElem.innerText = message;
    setTimeout(function () {
        alertElem.classList.remove(htmlClass);
        alertElem.innerText = "";
    }, 500);
}
/**
 * to hide and show different boxes on the page
 * @param {boolean} value true if boxes have to be hidden
 */
function hideBoxes(value) {
    let resultBox = document.getElementById("resultBox");
    resultBox.hidden = value;
    // let nominationBox = document.getElementById("nominationBox");
    // nominationBox.hidden = value;
}
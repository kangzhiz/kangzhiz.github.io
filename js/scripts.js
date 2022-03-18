/*
 * Change name text to just initials for smaller screen sizes
 */

let spans = [];
let fullNames = [];

function concatText() {
    let size = window.innerWidth;

    for (let i = 0; i < spans.length; i++) {
        let name = spans[i].textContent;
        console.log(name);
        spans[i].textContent = size > 876 ? fullNames[i] : name[0];
    }
};

window.onload = function() {
    spans = document.getElementsByClassName('name');

    // store full names in case the window size is increased
    for (let i = 0; i < spans.length; i++) {
        fullNames.push(spans[i].textContent);
    }

    concatText();
}

window.onresize = concatText;


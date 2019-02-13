
var myHeading = document.querySelector('h1');

if (!localStorage.getItem('name')) {
    setUserName();
}else {
    var storedname = localStorage.getItem('name');
    myHeading.textContent = 'eBriefing - ' + storedname;
}

var myImage = document.querySelector('img');

myImage.onclick = function() {
var mySrc = myImage.getAttribute('src');
if (mySrc === 'images/firefox-icon.png') {
    myImage.setAttribute('src', 'images/jetstar.png');
}else {
    myImage.setAttribute('src', 'images/firefox-icon.png');
}
}

var myButton = document.querySelector('button');


function setUserName() {
    var myName = prompt('Please enter your name.');
    localStorage.setItem('name', myName);
    myHeading.textContent = 'eBriefing - ' + myName;
}
myButton.onclick = function() {
    setUserName();
}
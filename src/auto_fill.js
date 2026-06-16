function autofill() {
var level = document.getElementById("level");
var lang = document.getElementById("language");
var title = document.getElementById("title");

var curRAs = RAs[lang][level]

if (!(title in curRAs)) {
return;
}

var curRA = curRAs[title];

document.getElementById("abstract").innerHTML = curRA.abstract;
document.getElementById("main-text").innerHTML = curRA["Main-text"];

for (var relRA in curRA["RelatedAides"]) {

}
}


function assembleRA() {


}
//////////////////////////// BASIC FORM FUNCTIONS

function displayLevelForm() {
    var lvl = document.getElementById("level");
    var curId = "form-lvl-" + lvl.value;

    for (i=1; i<=3; i++){
        document.getElementById("form-lvl-"+i).style.display = "none";
    }
    document.getElementById(curId).style.display = "block";
}


function submitForm() {
    // var metaContent = 
    
}

//////////////////////////// BASIC FORM CHECKING
function checkTitle() {
    var title = document.getElementById("title");

    if (title.value.includes('Personen')) {
        document.getElementById("title-warn").innerHTML = "This title already exists.";
        title.style.backgroundColor = "red";
    } else {
        document.getElementById("title-warn").innerHTML = "";
        title.style.backgroundColor = ''; 
    }
}

////////////////////////////


//////////////////////////// API FUNCTIONS

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
        
function geonamesSuggestions(){
    var place = document.getElementById("place");
    if (place.value === "") {
        // alert(document.getElementById("geonames-suggestions").innerHTML);
        document.getElementById("geonames-suggestions").innerHTML = "";
    } else {
        function useList(responseList) {
            document.getElementById("geonames-suggestions").innerHTML = responseList;
        }
        httpGetAsync("http://secure.geonames.org/search?username=research_aids&maxRows=3&countryBias=nl&q="+place.value,
                    useList);
                
    }
}

////////////////////////////
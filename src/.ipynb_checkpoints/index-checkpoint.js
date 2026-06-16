
langs = ["English", "Dutch"];
levels = ["1", "2", "3"];

RAs = {};
for (const lang of langs) {
  RAs[lang] = {};
  for (const lvl of levels) {
        RAs[lang][lvl] = {};
    }
}

function flatten_RAs(language) {
  var cur = RAs[language];
  var flattened = {};
  for (var lvl in cur) {
    for (var title in cur[lvl]) {
       flattened[title] = cur[lvl][title];   
    }
  }

  return flattened;
  
}



function displayLevelForm() {
  var lvl = document.getElementById("level").value;

  if (lvl > 1) {
    var sections = document.getElementsByClassName("level2");
    for (i=0; i<sections.length; i++) {
      sections[i].style.display = "block";
    }
  } else {
    var sections = document.getElementsByClassName("level2");
    for (i=0; i<sections.length; i++) {
      sections[i].style.display = "none";
    }
  }
}



// function displayLevelForm() {
//     for (i=1; i<=3; i++){
//         document.getElementById("level-"+i).style.display = "none";
//     }
  
//     var lvl = document.getElementById("level");
//     document.getElementById( "level-" + lvl.value).style.display = "block";
// }


function defaultToday(curElement) {
    // document.getElementById('edit-time').valueAsDate = new Date();
    curElement.valueAsDate = new Date();
}



// function check_resize(elem, min_height) {
//     // alert(`${elem.offsetHeight} vs ${elem.height}`);

//     if (elem.offsetHeight > min_height) {
//         elem.height = elem.offsetHeight;
//         alert(`${elem.offsetHeight} vs ${elem.height}`);
//     }
// }





async function init() {
    // var pwd = prompt("Enter the password to decrypt the token.");

    displayLevelForm();
    tab_display("relevant-data-identifiers", "relevant-data-container");
    tab_display("sources-primary", "sources-container");
  

  
    var pwd = "ResearchAids@NIOD!";
    octokit = await decrypt_token(pwd);
    await listAll();
    
    
    fillTitles();
    fillRelatedRAs();
    
}


function clearElement(elem) {
  if (typeof variable !== 'undefined' && variable !== null){
    while (options.firstChild) {
      options.removeChild(options.lastChild);
    }
  }
}


function fillTitles() {
    var lang = document.getElementById("language").value;
    var level = document.getElementById("level").value;
    // var curTitles = [];
    var options = document.getElementById('matching-RAs');
    clearElement(options);

    // var optGroup = document.createElement("optgroup");
    // optGroup.label = `Level ${level}`;
  
    for (var cur_title in RAs[lang][level]) {
        var option = document.createElement('option');
        option.value = cur_title;
        option.innerHTML = cur_title;
        // option.onclick = function() { alert(title); };
        options.appendChild(option);
    } 
    // options.appendChild(optGroup);

}


function fillRelatedRAs() {
    var lang = document.getElementById("language").value;
    var options = document.getElementById('related-aid-name');
    clearElement(options);
    
    var cur = RAs[lang];  
    for (var lvl in cur) {
      var optGroup = document.createElement("optgroup");
      optGroup.label = `Level ${lvl}`;

      for (var cur_title in cur[lvl]) {
          var option = document.createElement('option');
          option.value = cur_title;
          option.innerHTML = cur_title;
          console.log(cur_title);
          optGroup.appendChild(option);
          console.log(options);
      }
      options.appendChild(optGroup);
    }
    
}


  












// function suggestTitle(curtitle, current_level_only) {
//     var lang = document.getElementById("language").value;
//     var level = document.getElementById("level").value;

//     if (curtitle.length < 1) {
//        var complete_list = 
//     }
// }


function changeTitle(curtitle) {
    var lang = document.getElementById("language").value;
    var level = document.getElementById("level").value;
    var title = document.getElementById("title").value;
    var notice = document.getElementById("title-notice");

    if (title.length < 3) {
        notice.innerHTML = "";
        return;
    }

    // nothing really needs to happen here
  
    if (title in RAs[[level, lang]]) {
        
        // var curRA = RAs[[level, lang]][title];
        notice.innerHTML = "";
    } else {
        // RAs[[level, lang]][title] = {};
        notice.innerHTML = `<i> "${title}" is not an existing Research Aid. A new one will be created upon submission!</i>`;
    }   
}


function autofill() {
    var lang = document.getElementById("language").value;
    var level = document.getElementById("level").value;
    var title = document.getElementById("title").value;

    if (title in RAs[level, lang]) {
        var curRA = RAs[[level, lang]][title];

        document.getElementById("abstract").innerHTML = curRA.Abstract;
        document.getElementById("main-text").innerHTML = curRA["Main-text"]["content"];
        // related RAs
        // relevant data
        // sources
        // edit history
        // copyright info

    } else {
      // do nothing (or notice that the RA doesn't exist)
    }

}



function gather_info() {
  var RA_html = document.getElementById("related-aid-list");
  var ls = [];
  for (const elem of RA_html.children) {
    var cur_RA_info = related_RAs[elem.id];
    ls.push(cur_RA_info);
  }
  return ls;
}







function assembleRA(lang, level, title) {
    return `Language: ${lang}

Level: ${level}

Title: ${title}`;
    
}

async function submitForm() {
    var level, lang, title = getBasicData();
    
    // var lang = document.getElementById("language").value;
    // var level = document.getElementById("level").value;
    // var title = document.getElementById("title").value;

    var yamlStr = assembleRA(lang, level, title);
    var yamlBlob = getBlob(yamlStr);

    
    var statusMessage = document.getElementById("upload-status");
    try {
        var githubResponse = await uploadToGithub(title, yamlStr);
        console.log(githubResponse);
        var a = githubResponse.data.content.html_url;
        statusMessage.innerHTML = `Successfully created <a href="${a}" target="_blank">${a}</a>`;
        statusMessage.style.color = "green";
    } catch {
        statusMessage.innerHTML = `Error creating 'niveau${level}/${lang}/${title}'!`;
        statusMessage.style.color = "red";
    }
}






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

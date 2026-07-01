folders = ["published", "review"];
langs = ["English", "Dutch"];
levels = ["1", "2", "3"];

function init_RAs(RA_dict) {
  for (const lang of langs) {
    RA_dict[lang] = {};
    for (const f of folders) {
      RA_dict[lang][f] = {};
      for (const lvl of levels) {
            RA_dict[lang][f][lvl] = {};
        }
    }
  }
  return RA_dict;
}


// published = init_RAs({});
// review = init_RAs({});

RAs = init_RAs({});


function flatten_RAs(curRAs, language) {
  var cur = curRAs[language];
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



async function setup_repo(pwd) {
    var pwd = document.getElementById("pwd-value").value;
    octokit = await decrypt_token(pwd);

    if (octokit) {
      document.getElementById("setup-button").disabled = true;
      document.getElementById("progressContainer").hidden = false;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function init() {
    // var pwd = prompt("Enter the password to decrypt the token.");

    // document.getElementById("start").showPopover();
    document.getElementById("pwd").showPopover();

  
    displayLevelForm();
    tab_display("relevant-data-identifiers", "relevant-data-container");
    tab_display("sources-primary", "sources-container");
  


    while (octokit === null) {
      // document.getElementById("test").style.backgroundColor = "red";
      await sleep(500);
      // document.getElementById("loading").innerHTML += ".";  
    }
    // document.getElementById("test").style.backgroundColor = "green";

    // var pwd = "ResearchAids@NIOD!";
    // await setup_repo(pwd);

    await listAll();
    // document.getElementById("loading").innerHTML = "<i style='color:green'>done</i>";
    document.getElementById("get-started").disabled = false;
    document.getElementById("full-options").disabled = false;
  
  


    var copyright_Date = document.getElementById("copyright-time");
    var edit_Date = document.getElementById("edit-time");
    var today = new Date();
    copyright_Date.value = today.toISOString().substr(0, 10);
    edit_Date.value = today.toISOString().substr(0, 10);
}

function presetNormal() {
    fillTitles();
    fillRelatedRAs();
}

function presetVisitor() {
    document.getElementById("language").value = "Dutch";
    document.getElementById("folder").value = "review";
    document.getElementById("level").value = "3";
  
    document.getElementById("language-container").style.display = "none";
    document.getElementById("folder-container").style.display = "none";
    document.getElementById("level-container").style.display = "none";
  
    fillTitles();
    fillRelatedRAs();
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
    var folder = document.getElementById("folder").value;
    var level = document.getElementById("level").value;
    var title = document.getElementById("title").value;
    var notice = document.getElementById("title-notice");

    if (title.length < 3) {
        notice.innerHTML = "";
        return;
    }

    // nothing really needs to happen here
  
    if (title in RAs[lang][folder][level]) {
        
        // var curRA = RAs[[level, lang]][title];
        notice.innerHTML = "";
    } else {
        // RAs[[level, lang]][title] = {};
        notice.innerHTML = `<i> "${title}" is not an existing Research Aid. A new one will be created upon submission!</i>`;
    }   
}


// function autofill() {
//     var lang = document.getElementById("language").value;
//     var level = document.getElementById("level").value;
//     var title = document.getElementById("title").value;

//     if (title in RAs[level, lang]) {
//         var curRA = RAs[[level, lang]][title];

//         document.getElementById("abstract").innerHTML = curRA.Abstract;
//         document.getElementById("main-text").innerHTML = curRA["Main-text"]["content"];
//         // related RAs
//         // relevant data
//         // sources
//         // edit history
//         // copyright info

//     } else {
//       // do nothing (or notice that the RA doesn't exist)
//     }

// }




//////////////////////////////////////////////////////////////////////////////////////////////////////




async function submit() {

    var [RAObj, path] = collect_data();
    path = path.replace("/published/", "/review/");
    var yamlStr = jsyaml.dump(RAObj, {quotingType: '"', schema: jsyaml.JSON_SCHEMA});
    

    
    var statusMessage = document.getElementById("upload-status");
    try {
        var githubResponse = await uploadToGithub(path, yamlStr);
        console.log(githubResponse);
        // var a = githubResponse.data.content.html_url;
        // statusMessage.innerHTML = `Successfully created <a href="${a}" target="_blank">${a}</a>`;
        // statusMessage.style.color = "green";
    } catch {
        // statusMessage.innerHTML = `Error creating`;// 'niveau${level}/${lang}/${title}'!`;
        // statusMessage.style.color = "red";
    }
}


function preview() {
  var RAObj = collect_data();
  var yamlStr = jsyaml.dump(RAObj, {quotingType: '"'});

  var yamlBlob = getBlob(yamlStr);

  window.open(yamlBlob, '_blank');

}


//////////////////////////////////////////////////////////////////////////////////////////////////////




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

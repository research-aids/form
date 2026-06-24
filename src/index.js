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
    // alert("clicked!");
    // var pwd = "ResearchAids@NIOD!";
    document.getElementById("loading").innerHTML = "loading";

    var pwd = document.getElementById("pwd-value").value;
    octokit = await decrypt_token(pwd);

    document.getElementById("setup-button").disabled = "true";

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
    document.getElementById("loading").innerHTML = "<i style='color:green'>done</i>";

  
    fillTitles("review");
    fillRelatedRAs();


    var copyright_Date = document.getElementById("copyright-time");
    var edit_Date = document.getElementById("edit-time");
    var today = new Date();
    copyright_Date.value = today.toISOString().substr(0, 10);
    edit_Date.value = today.toISOString().substr(0, 10);
}

function presetVisitor() {
  document.getElementById("language").value = "Dutch";
  document.getElementById("folder").value = "review";
  document.getElementById("level").value = "3";

  document.getElementById("language-container").style.display = "none";
  document.getElementById("folder-container").style.display = "none";
  document.getElementById("level-container").style.display = "none";
  
  
}


function clearElement(elem) {
  if (typeof variable !== 'undefined' && variable !== null){
    while (options.firstChild) {
      options.removeChild(options.firstChild);
    }
  }
}


function fillTitles() {
    var lang = document.getElementById("language").value;
    var folder = document.getElementById("folder").value;
    var level = document.getElementById("level").value;
    // var curTitles = [];
    var options = document.getElementById('matching-RAs');
    options.innerHTML = "";// clearElement(options);

    // var optGroup = document.createElement("optgroup");
    // optGroup.label = `Level ${level}`;
  
    for (var cur_title in RAs[lang][folder][level]) {
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
    options.innerHTML = ""; //clearElement(options);

    // var folders = [published, review];
    // var folderNames = ["published", "review"];
    // for (let i = 0; i < folder.length; i++) {
    var curRAs = RAs[lang];

    for (var folder in curRAs) {
      // var optGroupOuter = document.createElement("optgroup");
      // optGroupOuter.label = `${folder}`;

      var cur = curRAs[folder];
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
      // options.appendChild(optGroupOuter);
    }
}


  












// function suggestTitle(curtitle, current_level_only) {
//     var lang = document.getElementById("language").value;
//     var level = document.getElementById("level").value;

//     if (curtitle.length < 1) {
//        var complete_list = 
//     }
// }


// function changeTitle(curtitle) {
//     var lang = document.getElementById("language").value;
//     var folder = document.getElementById("folder");
//     var level = document.getElementById("level").value;
//     var title = document.getElementById("title").value;
//     var notice = document.getElementById("title-notice");

//     if (title.length < 3) {
//         notice.innerHTML = "";
//         return;
//     }

//     // nothing really needs to happen here
  
//     if (title in RAs[lang][folder][level]) {
        
//         // var curRA = RAs[[level, lang]][title];
//         notice.innerHTML = "";
//     } else {
//         // RAs[[level, lang]][title] = {};
//         notice.innerHTML = `<i> "${title}" is not an existing Research Aid. A new one will be created upon submission!</i>`;
//     }   
// }


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

// async function submitForm() {
//     var level, lang, title = getBasicData();
    
//     // var lang = document.getElementById("language").value;
//     // var level = document.getElementById("level").value;
//     // var title = document.getElementById("title").value;

//     var yamlStr = assembleRA(lang, level, title);
//     var yamlBlob = getBlob(yamlStr);

    
//     var statusMessage = document.getElementById("upload-status");
//     try {
//         var githubResponse = await uploadToGithub(title, yamlStr);
//         console.log(githubResponse);
//         var a = githubResponse.data.content.html_url;
//         statusMessage.innerHTML = `Successfully created <a href="${a}" target="_blank">${a}</a>`;
//         statusMessage.style.color = "green";
//     } catch {
//         statusMessage.innerHTML = `Error creating 'niveau${level}/${lang}/${title}'!`;
//         statusMessage.style.color = "red";
//     }
// }



//////////////////////////////////////////////////////////////////////////////////////////////////////





function getRelatedRAs() {
    var ls = document.getElementById("related-aid-list");
    
    
}


function createNew(lvl, title) {
    // var lang = document.getElementById("language");
    // var folder = document.getElementById("folder");
    // var level = document.getElementById("level");
    // var title = document.getElementById("title");
  

    // add keys one-by-one -> need defaults which don't crash the pipelines
    return {
      "Level": lvl,
      "Title": title,

      "Abstract": "",
      "Main-text": {
        "content": "",
        "content-type": "text/markdown"
      },
      "RelatedAides": [],
      "Relevant data": {
        "Tags": {
          "Geographical": []
        }
      },
      "Sources": {
        "Primary sources": [],
        "Secondary sources": []
      },
      "copyright_metadata": {
        "copyright_holder": "",
        "date": "",
        "license": ""
      },
      "editing-metadata": []
    };
}



function collect_data() {
    var lang = document.getElementById("language").value;
    var folder = document.getElementById("folder").value;
    var level = document.getElementById("level").value;
    var title = document.getElementById("title").value;


    // var path = RAObj["fileinfo"]["path"];

    if (title in RAs[lang][folder][level]) {
        var RAObj = RAs[lang][folder][level][title];
        var path = RAObj["fileinfo"]["filepath"];

    } else {
        var RAObj = createNew(level, title);
        var path = `${folder}/niveau${level}/${lang}/${encodeURIComponent(title)}.yaml`;
    }

    RAObj["Abstract"] = tinyMDE1.getContent();
    RAObj["Main-text"]["content"] = tinyMDE2.getContent();

    RAObj["copyright_metadata"]["copyright_holder"] = document.getElementById("copyright").value;
    RAObj["copyright_metadata"]["date"] = document.getElementById("copyright-time").value;
    RAObj["copyright_metadata"]["license"] = document.getElementById("copyright-license").value;

  
    return [RAObj, path];
}


async function submit() {

    var [RAObj, path] = collect_data();
    path = path.replace("/published/", "/review/");
    var yamlStr = jsyaml.dump(RAObj, {quotingType: '"'});
    

    
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

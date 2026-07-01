function autofill() {
    var lang = document.getElementById("language").value;
    var folder = document.getElementById("folder").value;
    var level = document.getElementById("level").value;
    var title = document.getElementById("title").value;
    
    
    var curRAs = RAs[lang][folder][level];
    
    if (!(title in curRAs)) {
        return;
    }
    
    var curRA = curRAs[title];

    tinyMDE1.setContent(curRA.Abstract);
    tinyMDE2.setContent(curRA["Main-text"].content);
    
    for (relRA of curRA["RelatedAides"]) {
        var cur_title = Object.keys(relRA)[0];
        var cur_rel = relRA[cur_title]["rel_type"];
        createListElement('related-aid-list', createRelatedRA(cur_title, cur_rel));
    }


    var copyright_meta = curRA["copyright_metadata"];
    document.getElementById("copyright").value = copyright_meta["copyright_holder"];
    document.getElementById("copyright-time").value = copyright_meta["date"].toISOString().substr(0, 10);;
    document.getElementById("copyright-license").value = copyright_meta["license"];

    var edit_history = curRA["editing_metadata"];
    for (d of edit_history) {
      // document.getElementById("editor").value = d.author;
      // document.getElementById("edit-time").value = d.date;
      // document.getElementById("edit-role").value = d.role;
      createListElement("edits-list", createEdit(d.author, d.date.toISOString().substr(0, 10), d.role))
    }


    if (level > 1) {
      document.getElementById("activity-start").value = curRA["Relevant data"]["Period of activity"]["Year of start"];
      document.getElementById("activity-end").value = curRA["Relevant data"]["Period of activity"]["Year of end"];



      for (s of curRA["Sources"]["Primary sources"]) {
        
      }
    }
}


function clearall() {
  tinyMDE1.setContent("");
  tinyMDE2.setContent("");

  clearList("related-aid-list");
  clearList("sources-primary-list");
  clearList("sources-secondary-list");
  clearList("edits-list");
  // var copyright_meta = curRA["copyright_metadata"];
  document.getElementById("copyright").value = "";
  var today = new Date();
  document.getElementById("copyright-time").value = today.toISOString().substr(0, 10);  
  document.getElementById("copyright-license").value = "";
  
  document.getElementById("activity-start").value = "";
  document.getElementById("activity-end").value = "";
}


// function assembleRA() {
//   var abstract = tinyMDE1.getContent();
//   var main_text = tinyMDE2.getContent();

// }





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
            // option.id = `${lang}/${folder}/${lvl}
            option.dataset.path = cur[lvl][cur_title].fileinfo.filepath;
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
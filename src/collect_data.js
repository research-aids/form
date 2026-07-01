function getRelatedRAs() {
    var related = [];
    
    for (const li_div of document.querySelectorAll('#related-aid-list .one')) {
        var path = li_div.dataset.path;
        var name = li_div.dataset.name;
        var rel = li_div.dataset.relation;

        var cur_related = {[name]: {"link": path, "rel_type": rel}};
        related.push(cur_related); 
    }
    
    return related;
}

function getEditHistory() {
    var hist = [];
    
    for (const li_div of document.querySelectorAll('#edits-list .one')) {
        // var author = li_div.dataset.author;
        // var role = li_div.dataset.role;
        // var date = li_div.dataset.date;
        // var applies_to = li_div.dataset.applies_to;
        // var editing_notes = li_div.dataset.editing_notes;
        // var cur_related = {[name]: {"link": path, "rel_type": rel}};
      
        const dict = { ...li_div.dataset }; 
        hist.push(dict); 
    }
    
    return hist;
}

function getSources() {
    var primary = [];
    document.querySelectorAll('#sources-primary-list .one').forEach((li_div) => {
    
    });

    var secondary = [];
    document.querySelectorAll('#sources-secondary-list .one').forEach((li_div) => {
    
    });
  
    return {"Primary sources": primary,
          "Secondary sources": secondary};
}


function getRelevantData(level) {
    var relevant_data = {
      "Tags": {
        "Activity": [],
        "Type of objects": [],
        "Geographical": []
      }
    };
    if (level == 3) {
        var activity = {"Year of start": document.getElementById("activity-start").value,
                        "Year of end": document.getElementById("activity-end").value
                        };
    
        
        var names = [];
        document.querySelectorAll('#names-list .one').forEach(
          (li_div) => {names.push(liv_div.dataset.name}
        );

        var ids = [];
        document.querySelectorAll('#identifiers-list .one').forEach(
          (li_div) => {ids.push(liv_div.dataset.identifier}
        );
      
    
        // relevant_data = {...activity, ...names, ...relevant_data};
        relevant_data["Period of activity"] = activity;
        relevant_data["Name variations"] = names;
        relevant_data["Identifiers"] = ids;
    }

    return relevant_data;
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
        var path = `${folder}/niveau${level}/${lang}/${encodeURIComponent(title)}.yml`;
    }

    RAObj["Abstract"] = tinyMDE1.getContent();
    RAObj["Main-text"]["content"] = tinyMDE2.getContent();


    RAObj["RelatedAides"] = getRelatedRAs();


    RAObj["copyright_metadata"]["copyright_holder"] = document.getElementById("copyright").value;
    RAObj["copyright_metadata"]["date"] = document.getElementById("copyright-time").value;
    RAObj["copyright_metadata"]["license"] = document.getElementById("copyright-license").value;

    RAObj["editing_metadata"] = getEditHistory();
  
  
    return [RAObj, path];
}




function autofill() {
    var level = document.getElementById("level").value;
    var lang = document.getElementById("language").value;
    var title = document.getElementById("title").value;
    
    var curRAs = RAs[lang][level];
    
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
}


function assembleRA() {
  var abstract = tinyMDE1.getContent();
  var main_text = tinyMDE2.getContent();

}
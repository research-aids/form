// RELATED RAs
// CODE FROM: https://stackoverflow.com/questions/10588607/tutorial-for-html5-dragdrop-sortable-list
document.querySelectorAll("li").forEach(listItem => {
  listItem.addEventListener("dragstart", handleDragstart);
  listItem.addEventListener("dragover", handleDragover);
  listItem.addEventListener("dragleave", handleDragleave);
  listItem.addEventListener("drop", handleDrop);
});


let draggedElement;

function handleDragstart(event) {
  draggedElement = this;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragover(event) {
  event.preventDefault(); // @note This is needed for drop to fire.
  event.dataTransfer.dropEffect = "move";
  this.classList.add("over");
}

function handleDragleave() {
  this.classList.remove("over");
}

function handleDrop(event) {
  var swap_id = draggedElement.id;
  draggedElement.innerHTML = this.innerHTML;
  draggedElement.id = this.id;
  
  this.innerHTML = event.dataTransfer.getData('text/html');
  this.id = swap_id;
  
  this.classList.remove("over");
}

function handleDragend() {
  draggedElement = null;
}


function removeListElem(buttonElem) {
    // const relatedList = document.getElementById("related-aid-list");
    // for(let i = 0; i <= relatedList.length; i++ ){
    //     l = relatedList[i];
    //     relatedList.remove();
    // }
    buttonElem.parentNode.parentNode.remove();
  // this needs to actually update the list of RAs as well
  // or maybe not and the list of related RAs stays purely in the DOM until "submit" is triggered
}


function clearList(listId) {
  document.getElementById(listId).innerHTML = "";
}


function clearElement(elem) {
  if (typeof variable !== 'undefined' && variable !== null){
    while (options.firstChild) {
      options.removeChild(options.firstChild);
    }
  }
}



listCounters = {};

function createListElement(listId, elementInnerHTML, storage_function) {

    if (!(listId in listCounters)) {
      listCounters[listId] = 0;
    }

    var listElem = document.createElement("li");
    listElem.id = `${listId}-${listCounters[listId]}`;
  
    // listElem.innerHTML = `<p class="one"><b>${name}</b><i>${rel}</i></p>
    // <p class="two">
    //   <button type="button" class="remove-btn" onclick="removeRelatedRA(this)">
    //     <span class="glyphicon glyphicon-remove"></span>
    //   </button>
    // </p>`;

    listElem.innerHTML = elementInnerHTML;
      //   <button type="button" class="remove-btn" onclick="editRelatedRA(this)">
      //   <span class="glyphicon glyphicon-pencil"></span>
      // </button>

    listElem.setAttribute('draggable', true);
    listElem.classList.add("drag-element");

    listElem.addEventListener("dragstart", handleDragstart);
    listElem.addEventListener("dragover", handleDragover);
    listElem.addEventListener("dragleave", handleDragleave);
    listElem.addEventListener("drop", handleDrop);
    
    var ls = document.getElementById(listId);
    ls.appendChild(listElem);

    // var cur_RA = {"name": name, "relation": rel};
    // related_RAs[listElem.id] = cur_RA;
  
    listCounters[listId] += 1;
}



relatedRAs = {};

function createRelatedRA(name, rel, path) {
    // var name = document.getElementById("related-aid-name").value;
    // var rel = document.getElementById("related-aid-relationship").value;

    if (name.trim().length < 1) {
      alert("The name field was empty! Please provide a name");
      return;
    }

    // DO THIS AT THE END BY GOING OVER THE HTML LIST
    // (otherwise, delete and changing of order needs to be implemented
    // var cur_RA = {"name": name, "relation": rel};
    // related_RAs[listElem.id] = cur_RA;

  
    return `<div class="one" data-path="${path}" data-name="${name}" data-relation="${rel}"><b>${name}</b></div><div class="three"><i>${rel}</i></div>
    <div class="two">
      <button type="button" class="remove-btn" onclick="removeListElem(this)">
        <span class="glyphicon glyphicon-remove"></span>
      </button>
    </div>`;
}

function createRelatedRAFromHTML() {
    var select = document.getElementById('related-aid-name');
    var selected_path = select.options[select.selectedIndex].dataset.path;

    var rel = document.getElementById("related-aid-relationship").value;


    return createRelatedRA(select.value, rel, selected_path);

}



function createIdentifier() {
  var ident = document.getElementById("relevant-data-indentifiers-input").value;
  return `<p class="one" data-identifier="${ident}"><b>${ident}</b></p>
      <p class="two">
        <button type="button" class="remove-btn" onclick="removeListElem(this)">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </p>`;
}

function createName() {
  var name = document.getElementById("relevant-data-names-input").value;
  return `<p class="one" data-name="${name}"><b>${name}</b></p>
      <p class="two">
        <button type="button" class="remove-btn" onclick="removeListElem(this)">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </p>`;
}

function createGeo() {
  
}

function createTag() {
    var tag_label = document.getElementById("relevant-data-tag-label").value;
    var tag_link = document.getElementById("relevant-data-tag-link").value;

    return `<p class="one" 
          data-label="${tag_label}"
          data-link="${tag_link}"><b>${label}</b></p>
      <p class="two">
        <button type="button" class="remove-btn" onclick="removeListElem(this)">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </p>`;
}


function createSource() {
  var source_type = document.getElementById("sources-type").value;
  var source_name = document.getElementById("sources-name").value;
  var source_links = document.getElementById("sources-links").value;
  var source_description = document.getElementById("sources-description").querySelector("span");
  var source_description = (source_description && source_description !== 'null' && source_description !== 'undefined') ? source_description.innerHTML : "";

  return `<p class="one"
          data-Name="${source_name}" 
          data-Type-of-source="${source_type}"
          data-Name="${link}"
  ><b><span>${source_name.slice(0, 50)}</span><span style="display: none">${source_name.slice(50)}</span></b>
            <span><i>${source_type}</i></span>
            <span style="display: none">${source_description}</span>
            <span style="display: none">${source_links}</span>
          </p>
    <p class="two">
      <button type="button" class="remove-btn" onclick="removeListElem(this)">
        <span class="glyphicon glyphicon-remove"></span>
      </button>
    </p>`;
}

function addSource() {
  var is_primary = document.getElementById("is-primary-source").value;
  var list_id = `sources-${is_primary}-list`;
  console.log(`list id is: ${list_id}`);
  createListElement(list_id, createSource());
}


function createEdit(author, date, role, applies_to, note) {
  return `<div class="one" 
  data-author="${author}" 
  data-role="${role}" 
  data-date="${date}"
  data-applies_to="${applies_to}"
  data-editing_notes="${note}"><b>${author}</b></div><div class="three"><i>${date}</i></div>
    <div class="two">
      <button type="button" class="remove-btn" onclick="removeListElem(this)">
        <span class="glyphicon glyphicon-remove"></span>
      </button>
    </div>`;
}

function createEditFromHTML() {
    var author = document.getElementById("editor").value;
    var date = document.getElementById("edit-time").value;
    var role = document.getElementById("edit-role").value;
    var applies_to = document.getElementById("edit-applies-to").value;
    var note = document.getElementById("edit-note").value;
    return createEdit(author, date, role, applies_to, note);
}
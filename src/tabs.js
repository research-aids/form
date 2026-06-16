function tab_display(button_id, tab_section_name) {
  // Declare all variables
  var i, tabcontent, tablinks;


  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementById(tab_section_name).getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementById(tab_section_name).getElementsByClassName("tabs-body");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(button_id+"-body").style.display = "block";
  document.getElementById(button_id).className += " active";
}


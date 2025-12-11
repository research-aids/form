# form
Entry form for the Research Aids -- auto-generates or -edits YAML files based on form values at https://github.com/colonial-heritage/research-guides-dev.


### dev notes

 - **form per Aid**: could be a separate HTML page on its own that gets embedded/made visible depening on the value of the drop-down 


 - **editing exisiting Aids**: `Title` field of form gives auto-complete suggestions of the existing Aids; on click pre-fills the form's input fields with Aid's info, so they can be edited (save then simply overwrites the existing Aid)
   -> clicking on suggested Aid pre-fills, ignoring the suggestions creates a new one (if it matches an existing name, there's a pop-up warning (or confirm))
   -> is `ls` on the `research-guides-dev` (via a request) too slow? -> form repo could also have a (automatically updated) list of aids (or even an entire copy of the `research-guides-dev` repo, see the `https://github.com/research-aids/research-aids.github.io` repo)
   -> need script to transform YAML file to form values (AND VICE-VERSA, duh)
   -> need to generate a PAT for the form repo to be able to create commits in the `research-guides-dev` repo



### TODO

 - add tooltips
   - for field `Language`: "Language tag for the Research Aid itself; this form (currently) only exists in English."    

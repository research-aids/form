
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////    BASICS   /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


octokit = null;


////////////////////////////////////
// THIS FUNCTION ENCRYPTED THE TOKEN
////////////////////////////////////
// function encrypt_token() {
//   var encrypted = CryptoJS.AES.encrypt(<THE TOKEN>, <THE PASSWORD>);
// return encrupted;

// }
async function getOctokit(token) {
    var octokitModule = await import("https://esm.sh/@octokit/core");
    var octokit = new octokitModule.Octokit({auth: token});
    return octokit;
}


async function decrypt_token(pwd) {
  var encrypted_token = "U2FsdGVkX1+s06Yro08hepQbJNaErDvbC+CMTeaW3bfmi6a7msSJsW02DiPY0BkV+9U7gO/CuJKyd+HMP35cAQ==";
  var decrypted = CryptoJS.AES.decrypt(encrypted_token, pwd);
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  
  if (! decrypted.startsWith("ghp_")) {
      alert("Decrypted token doesn't look like a valid GitHub token! Are you sure the password is correct?");
  } else {
    return await getOctokit(decrypted);
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////     READ    /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


async function listRAs(ispublished, level, language){
    // var octokit = await getOctokit();
    // var langEN = (language == 'English') ? 'English' : 'Dutch'; 
    var path = `${ispublished}/niveau${level}/${language}/`

    try {
      var folderContents = await octokit.request('GET /repos/colonial-heritage/research-aids/contents/'+path, 
                                                 {
                                                      owner: 'OWNER',
                                                      repo: 'research-aids',
                                                      path: path,
                                                      headers: {
                                                        'X-GitHub-Api-Version': '2022-11-28'
                                                      }
                                                  }
                                                );
      console.log(folderContents);
      return folderContents.data;
    } catch(err) {
      console.log(`${path} lead to ${err}`);
      return [];
    }
}

async function listAll() {
  var d = new Date();
  var time = d.getTime();

  const progressBar = document.getElementById('progress');
  const progressText = document.getElementById('progressText');
  var total = langs.length*folders.length*levels.length;
  var i = 0;
  for (const lang of langs) {
    for (const f of folders) {
      for (const lvl of levels) {
        var cur = await listRAs(f, lvl, lang);
        for (const fileObj of cur) {
            var RAContents = await getRAContents(f, lvl, lang, fileObj.name);
            
            RAs[lang][f][lvl][RAContents.Title] = RAContents;

          
        }
        const percent = ((i + 1) / total) * 100;
        progressBar.style.width = percent + '%';
        progressText.textContent = Math.round(percent) + '%';
        i += 1;

        // break;

      }
    }
      // alert(`level ${lvl} done`); 
  }
  
  // d = new Date();
  // time = d.getTime() - time;
  // alert(`that took ${time/1000} seconds`);
}



async function getRAContents(ispublished, level, lang, fileName) {
    var filePath = `${ispublished}/niveau${level}/${lang}/${fileName}`;
    var file = await octokit.request('GET /repos/colonial-heritage/research-aids/contents/'+encodeURIComponent(filePath), {
          owner: 'OWNER',
          repo: 'research-aids',
          path: filePath,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });

    function decodeBase64(base64) {
        // this function is from
        // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
        const text = atob(base64);
        const length = text.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        const decoder = new TextDecoder(); // default is utf-8
        return decoder.decode(bytes);
    }

    // the problem with "pure" atob() is that it doesn't work with UTF-8 characters 
    // (since they occupy more than byte?) 
    // var rawYAMLString = atob(file.data.content).replace('\r', '');
    var rawYAMLString = decodeBase64(file.data.content).replace('\r', '');
    // js-yaml is imported in the HTML
    var RAContent = jsyaml.load(rawYAMLString);

    var filedata = {};
    filedata["folder"] = ispublished;
    filedata["filename"] = encodeURIComponent(fileName);
    filedata["filepath"] = filePath;
    // filedata["sha"] = file.data.sha;
    RAContent["fileinfo"] = filedata;

    return RAContent;
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////    WRITE    ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////



function getBlob(text) {
    var data = new Blob([text], {type: 'text/yaml;charset=utf-8'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    // if (textFile !== null) {
    //   window.URL.revokeObjectURL(textFile);
    // }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
}


async function uploadToGithub(filename, text) {
    try {
      var orig_file = await octokit.request(`GET /repos/colonial-heritage/research-aids/contents/${filename}`, {
            owner: 'OWNER',
            repo: 'research-aids',
            path: filename,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
      var sha = orig_file.data.sha;
    } catch {
      var sha = "";
    }
    // var filename = `${title}.yml`.replace(/\s+/g, "").replace(/^\.+|\.+$/g, "");
    var response = await octokit.request(`PUT /repos/colonial-heritage/research-aids/contents/${filename}`, {
                              owner: 'colonial-heritage',
                              repo: 'research-aids',
                              path: filename,
                              message: 'first commit by Octokit',
                              sha: sha,
                              committer: {
                                name: 'vale',
                                email: 'valevogelmann@gmail.com'
                              },
                              content: btoa(text),
                              headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                              }
                            });
      
    return response;
}
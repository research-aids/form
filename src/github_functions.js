
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


async function listRAs(level, language){
    // var octokit = await getOctokit();
    // var langEN = (language == 'English') ? 'English' : 'Dutch'; 
    var path = `published/niveau${level}/${language}/`
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
}

async function listAll() {
  var d = new Date();
  var time = d.getTime();
  for (const lang of ["English", "Dutch"]) {
    for (const lvl of ["1", "2", "3"]) {
      var cur = await listRAs(lvl, lang);
      for (const fileObj of cur) {
        var RAContents = await getRAContents(lvl, lang, fileObj.name);
        
        RAs[lang][lvl][RAContents.Title] = RAContents;
      }
    }
    // alert(`level ${lvl} done`); 
  }
  d = new Date();
  time = d.getTime() - time;
  // alert(`that took ${time/1000} seconds`);
}



async function getRAContents(level, lang, fileName) {
    var filePath = `published/niveau${level}/${lang}/${fileName}`;
    var file = await octokit.request('GET /repos/colonial-heritage/research-aids/contents/'+filePath, {
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

    return RAContent;
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////    WRITE    ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////



function getBlob(text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    // if (textFile !== null) {
    //   window.URL.revokeObjectURL(textFile);
    // }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
}


async function uploadToGithub(title, text) {
    var filename = `${title}.yml`.replace(/\s+/g, "").replace(/^\.+|\.+$/g, "");
    var response = await octokit.request(`PUT /repos/valevo/form-auto-commit-test/contents/${filename}`, {
                              owner: 'valevo',
                              repo: 'form-auto-commit-test',
                              path: filename,
                              message: 'first commit by Octokit',
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

// receive messages and forward to the display method
window.addEventListener('message', async function(ev) {
    let data = ev.data
    if(data.type != "chat") {
        return
    }
    console.log(data);
    fetch("/api/my/mastrogpt/display", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(r => r.text())
    .then(t => {
        console.log(t)
        if(t !=  "") {
            let content =  document.getElementById("_display_container_");
            content.innerHTML = t;
        }
    })
    .catch(e => {
        content.innerHTML="<h1>Error!</h1><p>Check logs for details.</p>"
        console.log(e)
    })
})


window.addEventListener('click', function(event) {
    if (event.target.matches("#sv-srvlss-fun-btn")) {
        event.preventDefault();
        nameFunction = document.getElementById("nameFun2sv").value;
        if (nameFunction == "") {
            document.getElementById("_display_container_").appendChild(document.createTextNode("Please provide a name for the function"));
            return
        }
        // to get the credentials
        fetch("/api/my/mastrogpt/saveFunctions")
        /*
        fetch("/api/my/mastrogpt/saveFunctions", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({name: nameFunction})
        })
        */
        .then(r => r.json())
        .then( (data) => {
            console.log(data)
            let codeFunction = getCode()
            sendServelessFunction2save(data.AUTH, data.APIHOST, nameFunction, codeFunction.code, codeFunction.language)
        })
        .catch(e => {
            // content.innerHTML="<h1>Error!</h1><p>Check logs for details.</p>"
            console.log(e)
        })
    }
});
// get the code for the function to save
function getCode() {
    let language = document.getElementById("language").textContent
    let code = document.getElementById("code").textContent
    let res = {language: language, code: code}
    return res
}

function sendServelessFunction2save(AUTH, APIHOST, nameFunction, code, kind) {
    const url = `https://${APIHOST}/api/v1/namespaces/_/actions/${nameFunction}?overwrite=true`;
    const body = {
      namespace: "_",
      name: nameFunction,
      exec: {
        kind: kind,
        code: code
      }
    };
    console.log(body, AUTH)
  /*
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(AUTH)
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
    */
}
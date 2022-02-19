async function getAPIs() {
    let response = await fetch('https://api.publicapis.org/entries')
    let APIs = await response.json()
    return APIs.entries
}

function getAPIhtml(myAPI) {
    let auth
    let support
    if(myAPI.Auth === '') {
        auth = "None"
    } else {
        auth = myAPI.Auth
    }
    if(myAPI.HTTPS === 'true') {
        support = "Yes"
    } else {
        support = "No"
    }
    return `
        <div class='my-api'>
            <div class='my-api-name'><a href="${myAPI.Link}">${myAPI.API} (${myAPI.Category})</a></div>
            <div class='my-api-description'>${myAPI.Description}</div>
            <div class='my-api-stats my-api-auth'>Auth: ${auth}</div>
            <div class='my-api-stats my-api-https'>HTTPS: ${support}</div>
        </div>
    `
}

function displayAPIs(myAPIs) {
    document.body.innerHTML = `
        <h1 id='title'>API of API's</h1>
        <div class='all-apis'>
            ${myAPIs.map(getAPIhtml).join('')}
        </div>
    `        
}

getAPIs()
    .then(displayAPIs)
    .catch(e => console.log(`Error: ${e}`))
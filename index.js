/* 
    Bonus Challenge 

    Fetch the list of 642 open APIs from
        https://api.publicapis.org/entries
        
    Create a my-api component
        display the name and category of the API,
        the description, and also display the type 
        of Auth (if any) and whether or not the API 
        supports HTTPS
    
    Use CSS Grid to style my-api
        The title and category should be 
        listed as Title (Category) 
        and should link to the API docs
        
    The grid should have 4 rows
        3rem, 1rem, 4rem, 3rem respectively
        and 3 columns each 1/3rd of available width
        
    Finally, display all of the APIs
*/

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
            <div class='my-api-auth'>Auth: ${auth}</div>
            <div class='my-api-https'>HTTPS: ${support}</div>
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
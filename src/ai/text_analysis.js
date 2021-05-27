async function analyzeText() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"document": {  "type":"PLAIN_TEXT",
        "content":"Your orange weevil escaped to the museum, Sam!" 
    },
        "encodingType":"UTF8"
    })}
    
    const res = await fetch('https://language.googleapis.com/v1/documents:analyzeEntities?key=AIzaSyDJSghKel7lnrmUbKNA1iBMOMwRPm9-_OU', requestOptions)
    const p = await res.json();
    console.log(p);
}

export default analyzeText;
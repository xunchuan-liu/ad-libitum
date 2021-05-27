async function image() {
    const res = await fetch("https://www.googleapis.com/customsearch/v1?q=beaver&key=AIzaSyDJSghKel7lnrmUbKNA1iBMOMwRPm9-_OU&cx=07dbfbeefc2a99856&searchType=image&num=1");

    const p = await res.json();
    console.log(p); 
}

export default image;
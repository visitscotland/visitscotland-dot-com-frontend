const checkQueryString = (str) => {
    let urlParams;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flagID = urlParams.get('flag');
        if (flagID === str) {
            return true;
        }
    } catch(e) {
        // if window.location throws an error, set query
        // to fallback value ''
        console.log(e);
        urlParams = '';
    }
    
    
    return false;
}

export default checkQueryString;
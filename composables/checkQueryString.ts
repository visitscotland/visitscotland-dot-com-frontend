const checkQueryString = (str) => {
const urlParams = new URLSearchParams(window.location.search);
const flagID = urlParams.get('flag');
if (flagID === str) {
    return true;
}
return false;
}

export default checkQueryString;
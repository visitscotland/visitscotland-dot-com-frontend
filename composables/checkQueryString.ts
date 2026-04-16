/* eslint-disable @typescript-eslint/no-unused-vars */
const checkQueryString = (str) => {
    let urlParams;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flagID = urlParams.get('flag');
        if (flagID === str) {
            sessionStorage.setItem('flag', flagID);
            return true;
        } else if (sessionStorage.getItem('flag') === str) {
            return true;
        }
    } catch(e) {
        // if window.location throws an error, set query
        // to fallback value ''
        console.log(e);
        urlParams = '';
    }
    return false;
};

export default await checkQueryString;

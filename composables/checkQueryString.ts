/* eslint-disable @typescript-eslint/no-unused-vars */
const checkQueryString = (flag : string) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const flagID = urlParams.get('flag');
        if (flagID === str) {
            sessionStorage.setItem('queryStr', flagID);
            return true;
        } else if (sessionStorage.getItem('queryStr') === str) {
            return true;
        }
    } catch(e) {
        // Do nothing, just return false
    }
    return false;
};

export default checkQueryString;

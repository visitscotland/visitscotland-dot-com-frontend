/* eslint-disable @typescript-eslint/no-unused-vars */
const checkQueryString = (flag : string) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlFlagID = urlParams.get('flag');

        const activeFlagsString = sessionStorage.getItem('activeFlags');
        let activeFlags : any = {
        };

        if (activeFlagsString) {
            activeFlags = JSON.parse(activeFlagsString);
        }

        if (urlFlagID && urlFlagID === flag) {
            activeFlags[urlFlagID] = true;

            sessionStorage.setItem('activeFlags', JSON.stringify(activeFlags));

            return true;
        } else if (activeFlags[flag]) {
            return true;
        }
    } catch(e) {
        // Do nothing, just return false
    }
    return false;
};

export default checkQueryString;

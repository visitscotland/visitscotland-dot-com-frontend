/*
     * Check for the availability of the specified library
     * @param name {string} name - library to wait for
     * @param callback {function} - function to call if the library is loaded
     */
const checkVendorLibrary = (name: string, callback: any, interval = 0) => {
    window.setTimeout(() => {
        if (window[name]) {
            callback(window[name]);
        } else {
            checkVendorLibrary(name, callback, 500);
        }
    }, interval);
};

export default checkVendorLibrary;

import checkQueryString from './checkQueryString';
import { useFlagsStore } from '../stores/flags';

const checkFlag = (str) => {
    const flagsStore = useFlagsStore();
    const flags = flagsStore.flags;
    if ((flags.hasOwnProperty(str) && flags[str].enabled) || checkQueryString(str)) {
        return true;
    }
    return false;
}

export default checkFlag;
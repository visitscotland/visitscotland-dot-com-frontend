import checkQueryString from './checkQueryString.ts';
import { useFlagsStore } from '~/stores/flags.ts';

// this should be used in a conditional, eg:
// <template v-if="checkFlags('profile-page')">Feature flag enabled</template>

const checkFlag = (str) => {
    const flagsStore = useFlagsStore();
    const flags = flagsStore.flags;
    // eslint-disable-next-line no-prototype-builtins
    if ((flags.hasOwnProperty(str) && flags[str].enabled) || checkQueryString(str)) {
        return true;
    }
    return false;
};

export default checkFlag;

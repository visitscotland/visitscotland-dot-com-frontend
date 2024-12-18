<script>
import { h } from 'vue';

import {
    VsHeading,
    VsLink,
    VsList,
    VsAlert,
} from '@visitscotland/component-library/components';

export default {
    props: {
        inputContent: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const r = {
            components: {
                VsHeading,
                VsLink,
                VsList,
                VsAlert,
            },
            template: `${props.inputContent}`,
        };
        return () => h(r);
    },
};
</script>

const getNavLink = (input: any) : string => {
    let plainLink = '';

    if (input.model && input.model.plainLink) {
        plainLink = input.model.plainLink;
    } else if (input.plainLink) {
        plainLink = input.plainLink;
    }

    if (plainLink) {
        if (plainLink === '/resourceapi') {
            return '/';
        }

        return plainLink.replace('/resourceapi', '');
    }

    if (input.getUrl) {
        return input.getUrl();
    }

    return '';
};

export default getNavLink;

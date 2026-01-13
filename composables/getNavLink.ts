const getNavLink = (input: any) : string => {
    if (input.model && input.model.plainLink) {
        if (input.model.plainLink === '/resourceapi') {
            return '/';
        }

        return input.model.plainLink.replace('/resourceapi', '');
    }

    return input.getUrl();
};

export default getNavLink;

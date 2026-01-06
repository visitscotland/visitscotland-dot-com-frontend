const formatLink = (input: string): string => {
    if (input === '/resourceapi') {
        return '/';
    }

    return input.replace('/resourceapi', '');
};

export default formatLink;

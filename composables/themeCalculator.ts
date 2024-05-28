const themeCalculator = (
    themeIndex?: number,
    colourSchemeParam?: string[],
) => {
    let colourScheme = [
        'grey',
        'light',
        'light',
    ];

    if (colourSchemeParam) {
        colourScheme = colourSchemeParam;
    };

    if (themeIndex !== undefined) {
        return colourScheme[themeIndex];
    }

    return 'light';
};

export default themeCalculator;

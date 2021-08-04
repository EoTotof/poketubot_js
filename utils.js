const unidecode = require('unidecode');

const rollDice = (number, die) => {
    const rolls = [];
    for (let i = 0; i < number; i++) {
        rolls.push(Math.floor(Math.random() * die) + 1);
    }
    return rolls;
};

const normalizeString = (string) => {
    let normalizedString = unidecode(string);
    normalizedString = normalizedString.replace(/[\W_]/gu, '');
    normalizedString = normalizedString.toLowerCase();
    return normalizedString;
};

const sliceString = (string, maxLength, separator) => {
    const slicedString = [];

    let currentSlice = '';
    string.split(separator).forEach((slice) => {
        if (slice.length > maxLength) {
            // it shouldn't happen, but if a slice is too large,
            // we simply cut it in slices of acceptable length
            if (currentSlice !== '') slicedString.push(currentSlice);

            slicedString.push(...slice.match(new RegExp('[^]{1,' + maxLength + '}', 'g')));
            currentSlice = '';
        }
        else if ((currentSlice + slice).length > maxLength) {
            slicedString.push(currentSlice);
            currentSlice = slice;
        }
        else {
            currentSlice += slice;
        }
    });
    // push the last slice if it hasn't been already
    if (currentSlice !== '') slicedString.push(currentSlice);
    return slicedString;
};

module.exports = {
    rollDice: rollDice,
    normalizeString: normalizeString,
    sliceString: sliceString,
};
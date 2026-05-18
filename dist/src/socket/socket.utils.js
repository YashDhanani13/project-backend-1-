export const toPositiveInt = (value) => {
    const numberValue = Number(value);
    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

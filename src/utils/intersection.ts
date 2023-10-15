export const intersection = <T extends unknown>(array0: T[], array1: T[]): T[] => {
    const result: T[] = [];
    array0.forEach(item0 => {
        const findedItem1 = array1.find(item1 => item1 === item0);
        if (!findedItem1) {
            return;
        }
        const findedResultItem = result.find(resultItem => resultItem === item0);
        if (findedResultItem) {
            return;
        }
        result.push(item0);
    });
    return result;
};

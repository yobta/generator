import { Service } from '../client/interfaces/Service';

export const countOperationNames = (name: string, services: Service[]): number => {
    let count = 0;
    for (const service of services) {
        for (const operation of service.operations) {
            if (name === operation.name) {
                count++;
            }
        }
    }
    return count;
};

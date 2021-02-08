/*
import { Moment, utc } from 'moment';
import { deserializeDates } from './serialization';

describe('serialization', () => {
    it('should deserialize dates correctly', () => {
        interface TestType {
            id: string;
            createdAt: Moment;
            deleteableUntil: Moment;
        }

        // We do not add typing to this array, to simulate having no runtime type information
        const objects: TestType[] = [
            { id: '1', createdAt: '2018-10-10', deleteableUntil: '2019-10-10' } as any,
            { id: '2', createdAt: '2018-10-10', deleteableUntil: '2019-10-10' } as any,
            { id: '3', createdAt: '2018-10-10', deleteableUntil: '2019-10-10' } as any,
        ];

        deserializeDates<TestType, Moment>(objects, ['createdAt', 'deleteableUntil'], utc)
            .forEach((testObject: TestType) => {
                expect(testObject.createdAt.isValid()).toBe(true);
                expect(testObject.createdAt.get('year')).toBe(2018);
                expect(testObject.deleteableUntil.isValid()).toBe(true);
                expect(testObject.deleteableUntil.get('year')).toBe(2019);
            });
    });
});
*/

/*
import { mutate, query } from './typescript';

describe('Typescript', () => {
    it('should safely access an objects properties', () => {
        let obj = null;
        expect(query(obj, 'some.path')).toBeFalsy();

        obj = {};
        expect(query(obj, 'some.path')).toBeFalsy();

        obj = { some: { path: '1337' } };
        expect(query(obj, 'some.path')).toEqual('1337');

        obj = { some: { path: ['1337'] } };
        expect(query(obj, 'some.path')).toEqual(['1337']);

        obj = { some: { path: ['1337', '1338'] } };
        expect(query(obj, 'some.path.length')).toEqual(2);

        obj = { some: [{ path: '1337' }] };
        expect(query(obj, 'some.0.path')).toEqual('1337');

        obj = { some: [{ path: { to: '1337' } }] };
        expect(query(obj, 'some.0.path')).toEqual({ to: '1337' });

        obj = { some: [{ path: { to: null } }] };
        expect(query(obj, 'some.0.path.to.success')).toBeFalsy();
    });

    it('should mutate an objects property', () => {
        let obj = null;
        expect(() => mutate(obj, 'some.path', 1337)).toThrow();

        obj = {};
        expect(() => mutate(obj, 'some.path', 1337)).toThrow();

        obj = { some: { path: '1337' } };
        expect(mutate(obj, 'some.path', 7331)).toEqual({ some: { path: 7331 } });

        obj = { some: { path: ['1337'] } };
        expect(mutate(obj, 'some.path', 1337)).toEqual({ some: { path: 1337 } });

        obj = { some: [{ path: '1337' }] };
        expect(mutate(obj, 'some.0.path', 7331)).toEqual({ some: [{ path: 7331 }] });

        obj = { some: [{ path: { to: '1337' } }] };
        expect(mutate(obj, 'some.0.path', 1337)).toEqual({ some: [{ path: 1337 }] });

        obj = { some: [{ path: { to: null } }] };
        expect(mutate(obj, 'some.0.path.to', 1337)).toEqual({ some: [{ path: { to: 1337 } }] });
    });
});
*/

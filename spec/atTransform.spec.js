const atTransform = require("../transformation/atTransform");

describe("Transformation", () => {
    let data;
    beforeEach(() => {
        data = [{
            p: '6427.36000000',T: 1541197122822,m: false,a: 68789076,q: '00.01000000',f: 77060724,l: 77060724,M: 1
        },{
            p: '6427.36000000',T: 1541197122822,m: false,a: 68789076,q: '00.01000000',f: 77060724,l: 77060724,M: 1
        }, {
            p: '6427.36000000',T: 1541197122822,m: false,a: 68789077,q: '00.01000000',f: 77060725,l: 77060725,M: 1
        }, {
            p: '6427.38000000',T: 1541197122822,m: false,a: 68789077,q: '00.01000000',f: 77060725,l: 77060725,M: 1
        }, {
            p: '6427.37000000',T: 1541197122825,m: false,a: 68789078,q: '00.00100000',f: 77060726,l: 77060726,M: 1
        }, {
            p: '6427.35000000',T: 1541197128396,m: false,a: 68789079,q: '00.08955600',f: 77060727,l: 77060727,M: 1
        }]
    })

    it(`should get correct length of data array grouped by time (T) in seconds and by buyermaker (m) once aggregation has finished`, () => {
        const transformed = atTransform(data)

        expect(transformed.length).toBe(2)
    });

    it(`should get best price at time (T) in seconds once aggregation has finished`, () => {
        const transformed = atTransform(data)

        expect(transformed[0].p).toBe("6427.38000000")
        expect(transformed[1].p).toBe("6427.35000000")
    });

    it(`should aggregate quantity grouped by time (T) in seconds and buyermaker and take best price in that group`, () => {
        const expected = [{
            p: '6427.38000000',T: 1541197123,m: false,a: 68789077,q: '0.04100000',f: 77060725,l: 77060725,M: 1
        },{
            p: '6427.35000000',T: 1541197128, m: false,a: 68789079,q: '00.08955600',f: 77060727,l: 77060727,M: 1
        }]

        const transformed = atTransform(data)

        expect(transformed).toEqual(expected)
    });
});
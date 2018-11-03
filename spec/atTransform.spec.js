const atTransform = require("../transformation/atTransform");

describe("A suite", () => {
    let data;
    beforeEach(() => {
        data = [{
            p: '6427.37000000',
            T: 1541197122822,
            m: false,
            a: 68789076,
            q: '00.06230100',
            f: 77060724,
            l: 77060724,
            M: 1
        }, {
            p: '6427.37000000',
            T: 1541197122822,
            m: false,
            a: 68789077,
            q: '00.01080200',
            f: 77060725,
            l: 77060725,
            M: 1
        }, {
            p: '6427.37000000',
            T: 1541197122822,
            m: false,
            a: 68789078,
            q: '00.00001500',
            f: 77060726,
            l: 77060726,
            M: 1
        }, {
            p: '6427.35000000',
            T: 1541197128396,
            m: false,
            a: 68789079,
            q: '00.08955600',
            f: 77060727,
            l: 77060727,
            M: 1
        }]
    })

    it("should get the correct length of the data array after transformation", () => {
        const transformed = atTransform(data)

        expect(transformed.length).toBe(2)
    });

    it("should correctly transform the data by aggregating quantity grouped bt price, time and buyermaker", () => {
        const expected = [{
            p: '6427.37000000',
            T: 1541197122822,
            m: false,
            a: 68789076,
            q: '0.07311800', // would be better if i added leading zeros
            f: 77060724,
            l: 77060724,
            M: 1
        }, {
            p: '6427.35000000',
            T: 1541197128396,
            m: false,
            a: 68789079,
            q: '00.08955600',
            f: 77060727,
            l: 77060727,
            M: 1
        }]

        const transformed = atTransform(data)

        expect(transformed).toEqual(expected)
    });
});
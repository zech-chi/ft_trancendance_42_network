
export type TheEndPlace = {
    id: string;
    type: "red" | "green" | "yellow" | "blue";
    color: string;
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
    x3: number;
    y3: number;
    z3: number;
    i0: number;
    i1: number;
    i2: number;
};

export const THE_END_PLACES : TheEndPlace[] = [
    {
        id: "1",
        type: "red",
        color: "#ff1d25",
        x1: 0,
        y1: 0.6,
        z1: 0,
        x2: -7.3,
        y2: 0.6,
        z2: 7.3,
        x3: 7.3,
        y3: 0.6,
        z3: 7.3,
        i0: 0,
        i1: 2,
        i2: 1
    },
    {
        id: "2",
        type: "green",
        color: "#7ac943",
        x1: 0,
        y1: 0.6,
        z1: 0,
        x2: -7.3,
        y2: 0.6,
        z2: 7.3,
        x3: -7.3,
        y3: 0.6,
        z3: -7.3,
        i0: 0,
        i1: 1,
        i2: 2
    },
    {
        id: "3",
        type: "yellow",
        color: "#fcee21",
        x1: 0,
        y1: 0.6,
        z1: 0,
        x2: +7.3,
        y2: 0.6,
        z2: -7.3,
        x3: -7.3,
        y3: 0.6,
        z3: -7.3,
        i0: 0,
        i1: 2,
        i2: 1
    },
    {
        id: "4",
        type: "blue",
        color: "#3fa9f5",
        x1: 0,
        y1: 0.6,
        z1: 0,
        x2: +7.3,
        y2: 0.6,
        z2: -7.3,
        x3: +7.3,
        y3: 0.6,
        z3: +7.3,
        i0: 0,
        i1: 1,
        i2: 2
    },
]
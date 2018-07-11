const chessboard = [
    [-1, -2, -3, -4, -5, -3, -2, -1],
    [-6, -6, -6, -6, -6, -6, -6, -6],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 6,  6,  6,  6,  6,  6,  6,  6],
    [ 1,  2,  3,  4,  5,  3,  2,  1]
];

const moves = [
    {
        name: "wieza",
        id: 1,
        start: {
            x: 8,
            y: 8,
        },
        move: [
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        ]
    },
    {
        name: "kunik",
        id: 2,
        start: {
            x: 2,
            y: 2,
        },
        move: [
            [0,1,0,1,0],
            [1,0,0,0,1],
            [0,0,0,0,0],
            [1,0,0,0,1],
            [0,1,0,1,0]
        ]
    },
    {
        name: "goniec",
        id: 3,
        start: {
            x: 8,
            y: 8,
        },
        move: [
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        ]
    },
    {
        name: "hetman",
        id: 4,
        start: {
            x: 8,
            y: 8,
        },
        move: [
            [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
            [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
            [0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
            [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
            [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
            [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        ]
    },
    {
        name: "krul",
        id: 5,
        start: {
            x: 2,
            y: 2,
        },
        move:[
            [0,0,0,0,0],
            [0,1,1,1,0],
            [5,1,0,1,5],
            [0,1,1,1,0],
            [0,0,0,0,0],
        ]
    },
    {
        name: "pionek",
        id: 6,
        start: {
            x: 2,
            y: 2,
        },
        move: [
            [0,0,3,0,0],
            [0,4,2,4,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
        ]
    },
];

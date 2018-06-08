// if(module.exports !== undefined){
    const tf = require("@tensorflow/tfjs");
// }

const model = tf.sequential({
    name: "VChess",
    layers: [
        tf.layers.dense({
            units: 32,
            inputShape: [65],
            activation: 'sigmoid'
        }),
        tf.layers.dense({
            units: 32,
            activation: 'sigmoid'
        }),
        tf.layers.dense({
            units: 16,
            activation: 'sigmoid'
        }),
        tf.layers.dense({
            units: 4,
            activation: 'sigmoid'
        })
    ]
});

model.compile({
    optimizer: tf.train.adam(0.2),
    loss: tf.losses.meanSquaredError
});

async function calcMove(chessboard, side){
    return new Promise((resolve, reject) => {
        let in_arr = new Array();
        if(side == "black"){
            in_arr.push(0);
        }
        else{
            in_arr.push(1);
        }
        for (let y = 0; y < chessboard.length; y++) {
            for (let x = 0; x < chessboard[0].length; x++) {
                in_arr.push(chessboard[y][x]);
            }
        }
    
        tf.tidy(() => {
            const input = tf.tensor2d([in_arr]);
            const output = model.predict(input);
            let data = output.dataSync();
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.round( data[i] * 8.0 );
            }
            resolve(data);
        });
    });
}

let chessboard2 = [
    [-1, -2, -3, -4, -5, -3, -2, -1],
    [-6, -6, -6, -6, -6, -6, -6, -6],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 6,  6,  6,  6,  6,  6,  6,  6],
    [ 1,  2,  3,  4,  5,  3,  2,  1]
];

calcMove(chessboard2, "black").then((e) => console.log(e));
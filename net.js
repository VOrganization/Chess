const fs = require("fs");
const tf = require("@tensorflow/tfjs");

let model = tf.sequential({
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

// async function loadModel(){
//     let f0 = new File([fs.readFileSync("model/model.json")], "model.json");
//     let f1 = new File([fs.readFileSync("model/weights.bin")], "weights.bin");

//     let files = tf.io.browserFiles([f0, f1]);
//     tf.loadModel(files).then((e) => {
//         console.log("Succes Load Model");
//         model = e;
//         model.predict(tf.tensor2d([[0,1,2,3,4,5,6,7,8,9]])).print();
//     }).catch(() => console.log("Error Load Model"));
// }
// loadModel();

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
const tf = require("@tensorflow/tfjs");

async function DownloadModel(){
    let readString = function(data, offset, size){
        let tmp = "";
        for (let i = 0; i < size; i++) {
            tmp += String.fromCharCode(data.readUInt8(offset + i));
        }
        return tmp;
    }
    let readBuffer = function(data, offset, size){
        let buf = new Buffer(size);
        for (let i = 0; i < size; i++) {
            buf.writeInt8(data.readInt8(offset + i), i);
        }
        return buf;
    }
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://145.239.87.252:3000/model', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            let d = Buffer.from(new Uint8Array(this.response));
            if(readString(d, 0, 3) == "TFM"){
                let hash = readString(d, 3, 32);
                let model_size = d.readUInt32LE(35);
                let weight_size = d.readUInt32LE(39);
                let model = readBuffer(d, 43, model_size);
                let weight = readBuffer(d, 43 + model_size, weight_size);   
                console.log("Download Model " + hash);
                resolve({
                    hash: hash,
                    model: model,
                    weight: weight,
                });
            }
            else{
                reject(null);
            }
        };
        xhr.onerror = function(){
            reject(null);
        }
        xhr.send();
    });
}

async function LoadModel(model, weight){
    return new Promise((resolve, reject) => {
        let f0 = new File([model], "model.json");
        let f1 = new File([weight], "weights.bin");
        let files = tf.io.browserFiles([f0, f1]);
        tf.loadModel(files).then((e) => {
            resolve(e);
        }).catch(() => {
            reject();
        });
    });
}

async function CalcMove(model, board, side){
    return new Promise((resolve, reject) => {
        let in_arr = new Array();
        if(side == "black"){
            in_arr.push(0);
        }
        else{
            in_arr.push(1);
        }
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                in_arr.push(board[y][x] / 6.0);
            }
        }
        tf.tidy(() => {
            const input = tf.tensor2d([in_arr]);
            const output = model.predict(input);
            let data = output.dataSync();
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.floor( data[i] * 7.0 );
            }
            resolve(data);
        });
    });
}

module.exports.DownloadModel = DownloadModel;
module.exports.LoadModel = LoadModel;
module.exports.CalcMove = CalcMove;
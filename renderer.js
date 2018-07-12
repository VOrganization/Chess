const net = require("./net");
const fs = require("fs");
const crypto = require("crypto");
let model = null;
let modelHash = "";
let game;

function generateBoard(board, view, sets){
    board.html("");
    for (let y = 0; y < 8; y++) {
        let row = $("<div>").addClass("chessboard-row");
        for (let x = 0; x < 8; x++) {
            let field = $("<div>").addClass("chessboard-field");
            if((x + y) % 2 == 0){
                field.addClass("white");
            }
            let c = sets[y][x];
            if(c != 0){
                let img = "pieces/";
                let pawn_id = Math.abs(c);
                let pawn = $("<div>").addClass("chessboard-pawn").addClass("chessboard-pawn-" + pawn_id);
                if(c > 0){
                    img += "white";
                    pawn.addClass("chessboard-pawn-side-white");
                }
                else{
                    img += "black";
                    pawn.addClass("chessboard-pawn-side-black");
                }
                img += "_" + pawn_id + ".svg";
                pawn.html(`<img src="` + img + `" draggable="false" style="width: 100%;">`);
                field.append(pawn);
            }
            row.append(field);
        }
        row.append(`<div style="clear: both;"></div>`);
        board.append(row);
    }
}

async function makeNewGame(){
    return new Promise((resolve, reject) => {
        let clone_board = new Array();
        for (let i = 0; i < chessboard.length; i++) {
            let arr = new Array();
            for (let j = 0; j < chessboard[i].length; j++) {
                arr.push(chessboard[i][j]);              
            }   
            clone_board.push(arr);
        }
        resolve({
            board: clone_board,
            currentPlayer: 1,
            moves: [],
            players: [
                {
                    side: "black",
                    points: 0,
                    won: false
                },
                {
                    side: "white",
                    points: 0,
                    won: false
                }
            ]
        })
    });
}

async function botMove(game){
    return new Promise((resolve, reject) => {
        if(model !== null){
            net.CalcMove(model, game.board, game.players[game.currentPlayer].side).then((e) => {
                let move = e;
                console.log(move);
                checkMove(game, move[0], move[1], move[2], move[3]).then((e) => {
                    newMove(game, move[0], move[1], move[2], move[3]).then((e) => {
                        console.log("INFO: Bot move register");
                    }).catch((e) => {
                        reject("Error: Some error while making new move");
                    });
                }).catch((e) => {
                    reject("Error: Bot make incorrect move");
                });
            }).catch((e) => {
                reject("Error: While calc move by model");
            })
        }
        else{
            reject("Error: Don't have loaded model");
        }
    });
}

async function endGame(game){
    //upload to firebase
}

function checkField(game, side, x2, y2){
    let states = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let pawn = game.board[y][x];
            if((side == "white" && pawn > 0) || (side == "black" && pawn < 0) || pawn == 0){
                continue;
            }
            let m = moves[Math.abs(pawn) - 1];
            let mx = m.start.x - Math.abs(x - x2);
            let my = m.start.y - Math.abs(y - y2);

            try {
                if(m.move[my][mx] == 1){
                    let vx = 0;
                    let vy = 0;
                    if(x > x2){ vx = -1; }
                    if(x < x2){ vx =  1; }
                    if(y > y2){ vy = -1; }
                    if(y < y2){ vy =  1; }

                    let block = false;
                    let cx = x;
                    let cy = y;
                    while (!block) {
                        if(cx == (x2 - vx) && cy == (y2 - vy)){
                            break;
                        }
                        cx += vx;
                        cy += vy;
                        if(game.board[cy][cx] != 0){
                            block = true;
                        }
                    }
                    if(!block){
                        let state = {
                            state: 0,
                            pawn: pawn,
                            x: x,
                            y: y,
                        }
                        states.push(state);
                    }
                }
                if(m.move[my][mx] == 2){
                    let state = {
                        state: 0,
                        pawn: pawn,
                        x: x,
                        y: y,
                    }
                    states.push(state);
                }
            } catch (error) {}
        }
    }
    return states;
}

function checkStatus(game){
    let out = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if(Math.abs(game.board[y][x]) != 5){
                continue;
            }

            let side = game.board[y][x] > 0 ? "white" : "black";
            let states = checkField(game, side, x, y);
            let status = {
                side: side,
                state: 0,
                x: x,
                y: y,
            }

            if(states.length > 0){
                let canMove = false;
                for (let y2 = -1; y2 < 2; y2++) {
                    for (let x2 = -1; x2 < 2; x2++) {
                        let my = y + y2;
                        let mx = x + x2;
                        if(my > 7 || my < 0 || mx > 7 || mx < 0){
                            continue;
                        }
                        let field = game.board[my][mx];
                        if((field == 5 && side == "white") || (field == -5 && side == "black")){
                            continue;
                        }
                        if(field == 0){
                            if(checkField(game, side, mx, my).length == 0){
                                canMove = true;
                            }
                        }
                    }
                }
                if(canMove){
                    status.state = 1;
                }
                else{
                    status.state = 2;
                }
            }

            out.push(status);
        }   
    }
    return out;
}

async function syncBoard(board, game){
    console.log("syncBoard");
    for (let y = 0; y < 8; y++) {
        let row = $(board).children(".chessboard-row").eq(y);
        for (let x = 0; x < 8; x++) {
            let pawn = game.board[y][x];
            let pawn_id = Math.abs(pawn);
            let side = pawn > 0 ? "white" : "black"; 
            
            let field = row.children(".chessboard-field").eq(x);
            if(!field.children().hasClass(`chessboard-pawn-${pawn_id}`) ||
               !field.children().hasClass(`chessboard-pawn-side-${side}`) ||
               !(field.children().length == 0 && pawn_id == 0)
            ){
                if(pawn_id == 0){
                    field.empty();
                }
                else{
                    let _pawn = $("<div>").addClass("chessboard-pawn").addClass(`chessboard-pawn-${pawn_id}`);
                    _pawn.html(`<img src="pieces/${side}_${pawn_id}.svg" draggable="false" style="width: 100%;">`);
                    field.html(_pawn);
                }
            }
        }
    }
}

async function newMove(game, x1, y1, x2, y2){
    return new Promise((resolve, reject) => {
        let pawn = game.board[y1][x1];
        checkMove(game, x1, y1, x2, y2).then((e) => {
            game.moves.push({
                player: game.currentPlayer,
                pawn: pawn,
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            });

            let status = checkStatus(game);
            for (let i = 0; i < status.length; i++) {
                let s = status[i];
                if(s.state == 1){
                    alert(`${s.side}: Szach`);
                }
                if(s.state == 2){
                    endGame(game).then(() => console.log("Success Upload to Cloud"));
                    alert(`${s.side}: Szach Mat`);
                }
            }

            syncBoard($("#board0"), game);
            resolve();
        });
    });
}

async function checkMove(game, x1, y1, x2, y2){
    return new Promise((resolve, reject) => {
        let pawn = game.board[y1][x1];
        if(pawn == 0){
            reject("U can't move empty space");
        }
        let side = game.players[game.currentPlayer].side;
        side = pawn > 0 ? "white" : "black";
        // if(!(side == "black" && pawn < 0) && !(side == "white" && pawn > 0)){
        //     reject("U can't move enemie's figures");
        // }

        let pawn_id = Math.abs(pawn);
        let move = null;
        for (let i = 0; i < moves.length; i++) {
            if(moves[i].id == pawn_id){
                move = moves[i];
                break;
            }
        }
        if(move !== null){
            let x = Math.abs(x1 - x2);
            let y = Math.abs(y1 - y2);
            let mx = move.start.x - x;
            let my = move.start.y - y;

            let vx = 0;
            let vy = 0;
            if(x1 > x2){ vx = -1; }
            if(x1 < x2){ vx =  1; }
            if(y1 > y2){ vy = -1; }
            if(y1 < y2){ vy =  1; }

            let block = false;
            let cx = x1;
            let cy = y1;
            while (!block) {
                if(cx == (x2 - vx) && cy == (y2 - vy)){
                    break;
                }
                cx += vx;
                cy += vy;
                if(game.board[cy][cx] != 0){
                    block = true;
                }
            }
            
            if(block && pawn_id != 2){
                reject("You are blocked");
            }

            try {
                switch (move.move[my][mx]) {

                    //zwykly ruch
                    case 1:{
                        if(game.board[y2][x2] != 0 && ((pawn < 0 && game.board[y2][x2] < 0) || (pawn > 0 && game.board[y2][x2] > 0))){
                            reject("You can't beat your own pawn!");
                        }
                        else{
                            game.board[y2][x2] = pawn;
                            game.board[y1][x1] = 0;
                            resolve({
                                status: 0
                            });
                        }
                        break;
                    }

                    //ruch pionka naprzud
                    case 2:{
                        if(game.board[y2][x2] == 0){
                            game.board[y2][x2] = pawn;
                            game.board[y1][x1] = 0;
                            resolve({
                                status: 0
                            });
                        }
                        else{
                            reject("not ok");
                        }
                        break;
                    }

                    //ruch pionka na starcie o 2
                    case 3:{
                        if((y1 == 6 && pawn > 0) || (y1 == 1 && pawn < 0)){
                            game.board[y2][x2] = pawn;
                            game.board[y1][x1] = 0;
                            resolve({
                                status: 0
                            });
                        }
                        else{
                            reject("U can't make this move");
                        }
                        break;
                    }

                    //ruch pionka na boki kiedy jest przeciwnik
                    case 4: {
                        let tpawn = game.board[y2][x2];
                        if(tpawn != 0 && ((pawn < 0 && tpawn > 0) || (pawn > 0 && tpawn < 0))){
                            game.board[y2][x2] = pawn;
                            game.board[y1][x1] = 0;
                            resolve({
                                status: 0
                            });
                        }
                        else{
                            reject("U can't make this move");
                        }
                        break;
                    }

                    case 5: {
                        let s = side == "white" ? 1 : -1;
                        for (let i = 0; i < game.moves.length; i++) {
                            let m = game.moves[i];
                            if(m.pawn == s * 1 || m.pawn == s * 5){
                                reject("U make move before");
                            }
                        }

                        if(vx > 0){
                            game.board[y2][x2] = pawn;
                            game.board[y2][x2 - 1] = s * 1;
                            game.board[y1][x1] = 0;
                            game.board[y1][7] = 0;
                            resolve({
                                status: 0
                            });
                        }

                        if(vx < 0){
                            game.board[y2][x2] = pawn;
                            game.board[y2][x2 + 1] = s * 1;
                            game.board[y1][x1] = 0;
                            game.board[y1][0] = 0;
                            resolve({
                                status: 0
                            });
                        }

                        reject("U can't make roszada");
                        break;
                    }

                    default:{
                        reject("Undefined command");
                        break;
                    }
                }
            }
            catch (error) {
                reject("This move is incorrent");
            }
        }
        else{
            reject("Can't find this move in db");
        }
    });
}

function moveEvent() {
    let drag = false;
    let x1, y1;
    let parent;
    let pawn;

    $(document).on("mousedown", ".chessboard-pawn", function(e){
        pawn = $(this);
        drag = true;
        x1 = pawn.parent().index();
        y1 = pawn.parent().parent().index();
        pawn.css({
            width: pawn.width() + "px",
            height: pawn.height() + "px",
            position: "absolute",
            left: e.pageX - $(pawn).width() / 2,
            top: e.pageY - $(pawn).height() / 2, 
        });
    });

    $(document).mousemove(function (e) {
        if(drag){
            pawn.css({
                left: e.pageX - $(pawn).width() / 2,
                top: e.pageY - $(pawn).height() / 2,
            });
        }
    });

    $(document).mouseup(function (e){
        if(drag){
            drag = false;

            let field = null;
            for (let i = 0; i < $(".chessboard-field").length; i++) {
                let f = $(".chessboard-field").eq(i);
                let o = f.offset();
                if(o.left < e.pageX && e.pageX < (o.left + f.width()) && o.top < e.pageY && e.pageY < (o.top + f.height())){
                    field = f;
                    break;
                }
            }

            if(field !== null){
                let x2 = field.index();
                let y2 = field.parent().index();

                $(pawn).css({
                    left: "0px",
                    top: "0px",
                    position: "static",
                });

                newMove(game, x1, y1, x2, y2).catch((error) => {
                    alert("Error2");
                    alert(error);
                });

                // checkMove(game, x1, y1, x2, y2).then((e) => {
                //     let o = $(pawn).clone();
                //     o.css({
                //         left: "0px",
                //         top: "0px",
                //         position: "static",
                //     });
                //     $(field).html(o);
                //     $(pawn).remove();
                //     let p_id = game.board[y1][x1];
                //     game.board[y1][x1] = 0;
                //     game.board[y2][x2] = p_id;
                //     newMove(game,x1,y1,x2,y2).catch(() => console.log("Cricical Error"));
                // }).catch((e) => {
                //     $(pawn).css({
                //         left: "0px",
                //         top: "0px",
                //         position: "static",
                //     });    
                //     console.log(e);
                // })
            }
            else{
                $(pawn).css({
                    left: "0px",
                    top: "0px",
                    position: "static",
                });
            }
        }
    });
}

$(document).ready(function (e) {
    moveEvent();

    $(window).on("resize", function(){
        let h = $("#test").css("height");
        $("#sidebar").css("height", h + "px");
        for (let i = 0; i < $(".chessboard").length; i++) {
            $(".chessboard").eq(i).height($(".chessboard").eq(i).width());
        }
    });

    makeNewGame().then((g) => {
        game = g;
        generateBoard($("#board0"), "black", game.board);
        console.log("Create new game");
    });

    // net.DownloadModel().then((e) => {
    //     modelHash = e.hash;
    //     fs.writeFileSync("model/model.json", e.model);
    //     fs.writeFileSync("model/weights.bin", e.weight);
    //     net.LoadModel(e.model, e.weight).then((e) => {
    //         model = e;
    //         console.log("Load Model: " + modelHash);
    //         net.CalcMove(model, chessboard, "black").then((e) => {
    //             console.log(e);
    //         });
    //         net.CalcMove(model, chessboard, "white").then((e) => {
    //             console.log(e);
    //         });
    //     }).catch((e) => {
    //         console.log("Error While Load model");
    //     });
    // }).catch(() => {
    //     let model   = fs.readFileSync("model/model.json");
    //     let weights = fs.readFileSync("model/weights.bin");
    //     let hash    = crypto.createHash('md5').update(model.toString('utf-8') + weights.toString('utf-8')).digest("hex");
    //     net.LoadModel(model, weights).then((e) => {
    //         model = e;
    //         modelHash = hash;
    //         console.log("Load Model: " + modelHash);
    //         net.CalcMove(model, chessboard, "black").then((e) => {
    //             console.log(e);
    //         });
    //         net.CalcMove(model, chessboard, "white").then((e) => {
    //             console.log(e);
    //         });
    //     }).catch((e) => {
    //         console.log("Error While Load model");
    //     });
    // });

});
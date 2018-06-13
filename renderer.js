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
                }
                else{
                    img += "black";
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
                    points: 0
                },
                {
                    side: "white",
                    points: 0
                }
            ]
        })
    });
}

async function botMove(game){
    let move = await calcMove(game.board, game.players[game.currentPlayer].side);
    checkMove(game, move[0], move[1], move[2], move[3]).then((e) => {
        newMove(game, move[0], move[1], move[2], move[3]).then((e) => {
            console.log("OK");
        });
    });
}

async function newMove(game, x1, y1, x2, y2){
    return new Promise((resolve, reject) => {
        game.moves.push({
            player: game.currentPlayer,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
        });
        game.currentPlayer = game.currentPlayer == 1 ? 0 : 1;

        if(game.currentPlayer == 0){
            console.log("Gra BOT");
            botMove(game);
        }

        resolve();
    });
}

async function checkMove(game, x1, y1, x2, y2){
    return new Promise((resolve, reject) => {
        let pawn = game.board[y1][x1];
        if(pawn == 0){
            reject("U can't move empty space");
        }
        let side = game.players[game.currentPlayer].side;
        if(!(side == "black" && pawn < 0) && !(side == "white" && pawn > 0)){
            reject("U can't move enemie's figures");
        }

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

                    case 1:{
                        if(game.board[y2][x2] != 0 && ((pawn < 0 && game.board[y2][x2] < 0) || (pawn > 0 && game.board[y2][x2] > 0))){
                            reject("You can't beat your own pawn!");
                        }
                        else{
                            resolve("OK");
                        }
                        break;
                    }

                    case 2:{
                        if(game.board[y2][x2] == 0){
                            resolve("OK");
                        }
                        else{
                            reject("not ok");
                        }
                        break;
                    }

                    case 3:{
                        if((y1 == 6 && pawn > 0) || (y1 == 1 && pawn < 0)){
                            resolve("OK");
                        }
                        else{
                            reject("U can't make this move");
                        }
                        break;
                    }

                    case 4:{
                        let tpawn = game.board[y2][x2];
                        if(tpawn != 0 && ((pawn < 0 && tpawn > 0) ||(pawn > 0 && tpawn < 0))){
                            resolve("OK");
                        }
                        else{
                            reject("U can't make this move");
                        }
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
                checkMove(game, x1, y1, x2, y2).then((e) => {
                    let o = $(pawn).clone();
                    o.css({
                        left: "0px",
                        top: "0px",
                        position: "static",
                    });
                    $(field).html(o);
                    $(pawn).remove();
                    let p_id = game.board[y1][x1];
                    game.board[y1][x1] = 0;
                    game.board[y2][x2] = p_id;
                    newMove(game,x1,y1,x2,y2).then(() => console.log("OK")).catch(() => console.log("Cricical Error"));
                }).catch((e) => {
                    $(pawn).css({
                        left: "0px",
                        top: "0px",
                        position: "static",
                    });    
                    console.log(e);
                })
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

    calcMove(chessboard, "black").then((e) => console.log(e));

});
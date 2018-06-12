let game;
let currentPlayer = 0;

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
        name: "pionek",
        id: 6,
        start: {
            x: 2,
            y: 2,
        },
        move: [
            [0,0,0,0,0],
            [0,0,2,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
        ]
    },
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
            x: 0,
            y: 0,
        },
        move: [

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
];

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
            players: [
                {
                    side: "black"
                },
                {
                    side: "white"
                }
            ]
        })
    });
}

function makeMove(current_player, game, x1, y1, x2, y2){
    return new Promise((resolve, reject) => {
        let pawn = game.board[y1][x1];
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
                cx += vx;
                cy += vy;
                if(game.board[cy][cx] != 0){
                    block = true;
                }
                if(cx == x2 && cy == y2){
                    break;
                }
            }
            
            if(block){
                reject("You are blocked");
            }

            try {
                let state = move.move[my][mx];

                switch (state) {

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
                makeMove(currentPlayer, game, x1, y1, x2, y2).then((e) => {
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

    generateBoard($("#board0"), "black", chessboard);
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

});
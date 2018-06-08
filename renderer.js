
let chessboard = [
    [-1, -2, -3, -4, -5, -3, -2, -1],
    [-6, -6, -6, -6, -6, -6, -6, -6],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 6,  6,  6,  6,  6,  6,  6,  6],
    [ 1,  2,  3,  4,  5,  3,  2,  1]
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
                pawn.html(`<img src="` + img + `" draggable="false">`);
                field.append(pawn);
            }
            row.append(field);
        }
        row.append(`<div style="clear: both;"></div>`);
        board.append(row);
    }
}

function moveEvent() {
    let drag = false;
    let startX, startY, startMX, startMY;
    let parent;
    let pawn;

    $(document).on("mousedown", ".chessboard-pawn", function(e){
        pawn = $(this);
        drag = true;
        startX = pawn.offset().left;
        startY = pawn.offset().top;
        startMX = e.pageX;
        startMY = e.pageY;
        pawn.css({
            width: pawn.width() + "px",
            height: pawn.height() + "px",
            position: "absolute"
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
                if(o.left < e.pageX && e.pageX < (o.left + f.width()) && o.top < e.pageY && e.pageY < (o.top + f.height()) && f.children().length == 0){
                    field = f;
                    break;
                }
            }

            if(field !== null){
                let o = $(pawn).clone();
                o.css({
                    left: "0px",
                    top: "0px",
                    position: "static",
                });
                $(field).append(o);
                $(pawn).remove();
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

});
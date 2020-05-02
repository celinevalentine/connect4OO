// set a new class with 5 properties and 2 methods 

class Game {
    constructor(p1, p2, height = 6, width = 7) {
        this.height = height;
        this.width = width;
        this.players = [p1, p2];
        this.currPlayer = p1;
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
    }

    makeBoard() {
        this.board = [];
        for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
        }
    }
    makeHtmlBoard() {
        const board = document.getElementById('board');
        this.makeTopCol(board);
        this.handleToggle();
        this.makeMainBoard(board);
    }

    makeTopCol(board) {
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');

        // store a reference to the handleClick bound function 
        // so that we can remove the event listener correctly later
        this.handleGameClick = this.handleClick.bind(this);

        top.addEventListener("click", this.handleGameClick);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }
        board.append(top);
    }
    mouseEnterHandler(event) {
        event.target.style.backgroundColor = this.currPlayer.color;
    }
    mouseLeaveHandler(event) {
        event.target.style.backgroundColor = "";
    }
    handleToggle() {
        this.gameMouseEnterHandler = this.mouseEnterHandler.bind(this);
        this.gameMouseLeaveHandler = this.mouseLeaveHandler.bind(this);


        const topCells = document.querySelectorAll('#column-top td');
        for (let td of topCells) {
            td.addEventListener("mouseenter", this.gameMouseEnterHandler)
            td.addEventListener("mouseleave", this.gameMouseLeaveHandler);
        }
    }



    makeMainBoard(board) {
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }
            board.append(row);
        }
    }
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        // alert(msg);
        const top = document.getElementById("column-top");
        top.removeEventListener("click", this.handleGameClick);
        this.gameOver = true;
        setTimeout(alert, 1000, msg);

    }

    handleClick(evt) {

        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            this.gameOver = true;
            return this.endGame(`Then ${this.currPlayer.color} player won!`);
        }

        // check for tie
        const checkForTie = () => {
            this.board.every(row => row.every(cell => cell))
        };
        if (checkForTie()) {
            return this.endGame('Tie!');
        }

        // switch players
        this.currPlayer =
            this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    checkForWin() {
        const _win = (cells) =>
            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
            //  - returns true if all are legal coordinates & all match currPlayer

            cells.every(
                ([y, x]) =>
                y >= 0 &&
                y < this.height &&
                x >= 0 &&
                x < this.width &&
                this.board[y][x] === this.currPlayer
            );

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3]
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x]
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3]
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3]
                ];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}
class Player {
    constructor(color) {
        this.color = color;
    }
}

document.getElementById("start-game").addEventListener("click", () => {
    const table = document.querySelector("#board");
    table.innerHTML = "";
    let p1 = new Player(document.getElementById("player1").value);
    let p2 = new Player(document.getElementById("player2").value);
    new Game(p1, p2);

});
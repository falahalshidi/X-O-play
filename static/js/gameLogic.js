/**
 * X-O Game Logic with Minimax AI
 * منطق لعبة إكس أو مع خوارزمية Minimax للذكاء الاصطناعي
 */

function checkWinner(board) {
    /**
     * فحص الفائز في اللعبة
     * Returns: 'X', 'O', أو null
     */
    // جميع احتمالات الفوز (3 صفوف + 3 أعمدة + 2 أقطار)
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // أعمدة
        [0, 4, 8], [2, 4, 6]              // أقطار
    ];
    
    for (let combo of winCombinations) {
        if (board[combo[0]] && 
            board[combo[0]] === board[combo[1]] && 
            board[combo[1]] === board[combo[2]]) {
            return board[combo[0]];
        }
    }
    
    return null;
}

function isBoardFull(board) {
    /**فحص إذا كانت اللوحة ممتلئة*/
    return board.every(cell => cell !== null);
}

function getEmptyCells(board) {
    /**الحصول على جميع الخلايا الفارغة*/
    return board.map((cell, index) => cell === null ? index : null)
                .filter(index => index !== null);
}

function minimax(board, depth, isMaximizing, aiSymbol, playerSymbol) {
    /**
     * خوارزمية Minimax للذكاء الاصطناعي
     * Returns: النقاط (10 للفوز، -10 للخسارة، 0 للتعادل)
     */
    const winner = checkWinner(board);
    
    // إذا فاز الذكاء الاصطناعي
    if (winner === aiSymbol) {
        return 10 - depth;  // تفضيل الفوز السريع
    }
    
    // إذا فاز اللاعب
    if (winner === playerSymbol) {
        return depth - 10;  // تفضيل تأخير الخسارة
    }
    
    // إذا كانت اللوحة ممتلئة (تعادل)
    if (isBoardFull(board)) {
        return 0;
    }
    
    // إذا كان دور الذكاء الاصطناعي (maximizing)
    if (isMaximizing) {
        let bestScore = -Infinity;
        const emptyCells = getEmptyCells(board);
        
        for (let cell of emptyCells) {
            board[cell] = aiSymbol;
            const score = minimax(board, depth + 1, false, aiSymbol, playerSymbol);
            board[cell] = null;
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    }
    
    // إذا كان دور اللاعب (minimizing)
    else {
        let bestScore = Infinity;
        const emptyCells = getEmptyCells(board);
        
        for (let cell of emptyCells) {
            board[cell] = playerSymbol;
            const score = minimax(board, depth + 1, true, aiSymbol, playerSymbol);
            board[cell] = null;
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function getBestMove(board, aiSymbol = 'O', playerSymbol = 'X') {
    /**
     * الحصول على أفضل حركة للذكاء الاصطناعي
     * Returns: index of best move
     */
    let bestScore = -Infinity;
    let bestMove = null;
    const emptyCells = getEmptyCells(board);
    
    // نسخ اللوحة لتجنب تعديل الأصلية
    const boardCopy = [...board];
    
    for (let cell of emptyCells) {
        boardCopy[cell] = aiSymbol;
        const score = minimax(boardCopy, 0, false, aiSymbol, playerSymbol);
        boardCopy[cell] = null;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }
    
    return bestMove;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkWinner, isBoardFull, getBestMove };
}


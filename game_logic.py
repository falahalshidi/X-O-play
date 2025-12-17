"""
X-O Game Logic with Minimax AI
منطق لعبة إكس أو مع خوارزمية Minimax للذكاء الاصطناعي
"""


def check_winner(board):
    """
    فحص الفائز في اللعبة
    Returns: 'X', 'O', أو None
    """
    # جميع احتمالات الفوز (3 صفوف + 3 أعمدة + 2 أقطار)
    win_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # أعمدة
        [0, 4, 8], [2, 4, 6]              # أقطار
    ]
    
    for combo in win_combinations:
        if board[combo[0]] and board[combo[0]] == board[combo[1]] == board[combo[2]]:
            return board[combo[0]]
    
    return None


def is_board_full(board):
    """فحص إذا كانت اللوحة ممتلئة"""
    return all(cell is not None for cell in board)


def get_empty_cells(board):
    """الحصول على جميع الخلايا الفارغة"""
    return [i for i, cell in enumerate(board) if cell is None]


def minimax(board, depth, is_maximizing, ai_symbol, player_symbol):
    """
    خوارزمية Minimax للذكاء الاصطناعي
    Returns: النقاط (10 للفوز، -10 للخسارة، 0 للتعادل)
    """
    winner = check_winner(board)
    
    # إذا فاز الذكاء الاصطناعي
    if winner == ai_symbol:
        return 10 - depth  # تفضيل الفوز السريع
    
    # إذا فاز اللاعب
    if winner == player_symbol:
        return depth - 10  # تفضيل تأخير الخسارة
    
    # إذا كانت اللوحة ممتلئة (تعادل)
    if is_board_full(board):
        return 0
    
    # إذا كان دور الذكاء الاصطناعي (maximizing)
    if is_maximizing:
        best_score = float('-inf')
        for cell in get_empty_cells(board):
            board[cell] = ai_symbol
            score = minimax(board, depth + 1, False, ai_symbol, player_symbol)
            board[cell] = None
            best_score = max(score, best_score)
        return best_score
    
    # إذا كان دور اللاعب (minimizing)
    else:
        best_score = float('inf')
        for cell in get_empty_cells(board):
            board[cell] = player_symbol
            score = minimax(board, depth + 1, True, ai_symbol, player_symbol)
            board[cell] = None
            best_score = min(score, best_score)
        return best_score


def get_best_move(board, ai_symbol='O', player_symbol='X'):
    """
    الحصول على أفضل حركة للذكاء الاصطناعي
    Returns: index of best move
    """
    best_score = float('-inf')
    best_move = None
    
    for cell in get_empty_cells(board):
        board[cell] = ai_symbol
        score = minimax(board, 0, False, ai_symbol, player_symbol)
        board[cell] = None
        
        if score > best_score:
            best_score = score
            best_move = cell
    
    return best_move


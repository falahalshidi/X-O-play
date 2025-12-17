"""
X-O Game Flask Server
خادم Flask للعبة إكس أو
"""

from flask import Flask, render_template, request, jsonify
from game_logic import check_winner, is_board_full, get_best_move

app = Flask(__name__, static_folder='static', static_url_path='')

# حالة اللعبة
game_state = {
    'board': [None] * 9,
    'current_player': 'X',
    'scores': {'X': 0, 'O': 0},
    'round': 1,
    'player1_name': '',
    'player2_name': '',
    'mode': 'pvp',  # 'pvp' or 'ai'
    'game_over': False  # حالة انتهاء اللعبة
}


def is_game_over():
    """فحص إذا كانت اللعبة انتهت"""
    winner = check_winner(game_state['board'])
    is_full = is_board_full(game_state['board'])
    return winner is not None or is_full or game_state.get('game_over', False)


@app.route('/')
def index():
    """عرض الصفحة الرئيسية"""
    return render_template('index.html')


@app.route('/api/init_game', methods=['POST'])
def init_game():
    """تهيئة لعبة جديدة"""
    data = request.json
    
    game_state['board'] = [None] * 9
    game_state['current_player'] = 'X'
    game_state['scores'] = {'X': 0, 'O': 0}
    game_state['round'] = 1
    game_state['player1_name'] = data.get('player1_name', 'اللاعب 1')
    game_state['player2_name'] = data.get('player2_name', 'اللاعب 2')
    game_state['mode'] = data.get('mode', 'pvp')
    game_state['game_over'] = False
    
    return jsonify({
        'success': True,
        'board': game_state['board'],
        'current_player': game_state['current_player'],
        'scores': game_state['scores'],
        'round': game_state['round']
    })


@app.route('/api/make_move', methods=['POST'])
def make_move():
    """تنفيذ حركة اللاعب"""
    data = request.json
    position = data.get('position')
    
    # التحقق من أن اللعبة لم تنته بعد
    if is_game_over():
        return jsonify({'success': False, 'error': 'اللعبة انتهت'}), 400
    
    # التحقق من صحة الحركة
    if position is None or position < 0 or position > 8:
        return jsonify({'success': False, 'error': 'حركة غير صحيحة'}), 400
    
    if game_state['board'][position] is not None:
        return jsonify({'success': False, 'error': 'هذه الخانة محجوزة'}), 400
    
    # تنفيذ الحركة
    game_state['board'][position] = game_state['current_player']
    
    # فحص الفائز
    winner = check_winner(game_state['board'])
    is_draw = False
    
    if winner:
        game_state['scores'][winner] += 1
        game_state['game_over'] = True
    elif is_board_full(game_state['board']):
        is_draw = True
        game_state['game_over'] = True
    
    # تبديل اللاعب
    if not winner and not is_draw:
        game_state['current_player'] = 'O' if game_state['current_player'] == 'X' else 'X'
    
    return jsonify({
        'success': True,
        'board': game_state['board'],
        'current_player': game_state['current_player'],
        'winner': winner,
        'is_draw': is_draw,
        'scores': game_state['scores'],
        'round': game_state['round']
    })


@app.route('/api/ai_move', methods=['POST'])
def ai_move():
    """حساب وتنفيذ حركة الذكاء الاصطناعي"""
    # التحقق من أن اللعبة لم تنته بعد
    if is_game_over():
        return jsonify({'success': False, 'error': 'اللعبة انتهت'}), 400
    
    # التحقق من أن اللعبة في وضع AI
    if game_state['mode'] != 'ai':
        return jsonify({'success': False, 'error': 'اللعبة ليست في وضع AI'}), 400
    
    # التحقق من أن دور AI
    if game_state['current_player'] != 'O':
        return jsonify({'success': False, 'error': 'ليس دور AI'}), 400
    
    # الحصول على أفضل حركة
    best_move = get_best_move(
        game_state['board'].copy(),
        ai_symbol='O',
        player_symbol='X'
    )
    
    if best_move is None:
        return jsonify({'success': False, 'error': 'لا توجد حركات متاحة'}), 400
    
    # تنفيذ الحركة
    game_state['board'][best_move] = 'O'
    
    # فحص الفائز
    winner = check_winner(game_state['board'])
    is_draw = False
    
    if winner:
        game_state['scores'][winner] += 1
        game_state['game_over'] = True
    elif is_board_full(game_state['board']):
        is_draw = True
        game_state['game_over'] = True
    
    # تبديل اللاعب
    if not winner and not is_draw:
        game_state['current_player'] = 'X'
    
    return jsonify({
        'success': True,
        'board': game_state['board'],
        'current_player': game_state['current_player'],
        'winner': winner,
        'is_draw': is_draw,
        'scores': game_state['scores'],
        'round': game_state['round'],
        'ai_move': best_move
    })


@app.route('/api/next_round', methods=['POST'])
def next_round():
    """الانتقال للجولة التالية"""
    game_state['round'] += 1
    game_state['board'] = [None] * 9
    game_state['current_player'] = 'X'
    game_state['game_over'] = False
    
    return jsonify({
        'success': True,
        'board': game_state['board'],
        'current_player': game_state['current_player'],
        'scores': game_state['scores'],
        'round': game_state['round']
    })


@app.route('/api/reset_game', methods=['POST'])
def reset_game():
    """إعادة تعيين اللعبة"""
    game_state['board'] = [None] * 9
    game_state['current_player'] = 'X'
    game_state['scores'] = {'X': 0, 'O': 0}
    game_state['round'] = 1
    game_state['game_over'] = False
    
    return jsonify({
        'success': True,
        'board': game_state['board'],
        'current_player': game_state['current_player'],
        'scores': game_state['scores'],
        'round': game_state['round']
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


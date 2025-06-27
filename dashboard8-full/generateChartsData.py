import random
import string

def generate_game_stats(game_name, user_id):
    gamesWithAiEasy = random.randint(0, 999)
    gamesWithAiMedium = random.randint(0, 999)
    gamesWithAiHard = random.randint(0, 999)
    totalGamesWithAi = gamesWithAiEasy + gamesWithAiMedium + gamesWithAiHard

    easyWins = random.randint(0, gamesWithAiEasy)
    mediumWins = random.randint(0, gamesWithAiMedium)
    hardWins = random.randint(0, gamesWithAiHard)
    total_wins = easyWins + mediumWins + hardWins

    friends_total = random.randint(0, 999)
    friends_wins = random.randint(0, friends_total)
    friends_losses = friends_total - friends_wins

    return {
        'userId'            : f"'{user_id}'",
        'game'              : f"'{game_name}'",
        'totalGamesWithAi'  : totalGamesWithAi,
        'gamesWithAiEasy'   : gamesWithAiEasy,
        'gamesWithAiMedium' : gamesWithAiMedium,
        'gamesWithAiHard'   : gamesWithAiHard,
        'totalWins'         : total_wins,
        'easyWins'          : easyWins,
        'mediumWins'        : mediumWins,
        'hardWins'          : hardWins,
        'friendsWins'       : friends_wins,
        'friendsLosses'     : friends_losses,
        'friendsTotalGames' : friends_total
    }

def print_user_data():

    for i in range(1, 16):
        user_id = 'user' + str(i)+ '_id'
        games = ['pong', 'parchesi']
        print(f"    // user{i}")
        for j, game in enumerate(games, 1):
            stats = generate_game_stats(game, user_id)
            print("    {")
            for key, value in stats.items():
                print(f"        {key:<20}: {value},")
            print("    },\n")

print_user_data()

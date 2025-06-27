import random
import string

def generate_yearly_stats(year, user_id):
    totalGames = random.randint(100, 1000)
    totalActiveDays = random.randint(100, 1000)
    maxStreak = random.randint(100, 1000)
    daily_activity = [round(random.uniform(0.0, 1.0), 2) for _ in range(366)]

    return {
        'userId'            : f"'{user_id}'",
        'year'              : f"'{year}'",
        'totalGames'  : totalGames,
        'totalActiveDays'   : totalActiveDays,
        'maxStreak' : maxStreak,
        'DailyActivity'   : daily_activity,
    }

def print_user_data():

    for i in range(1, 16):
        user_id = 'user' + str(i)+ '_id'
        year = 2025 - i
        print(f"    // user{i}")
        stats = generate_yearly_stats(year, user_id)
        print("    {")
        for key, value in stats.items():
            print(f"        {key:<20}: {value},")
        print("    },\n")

print_user_data()

import random

skills = [
    "Quick_Reflexes",
    "Strategic_Thinking",
    "Precision_Shots",
    "Pattern_Recognition",
    "Anticipating_Moves",
    "Board_Control",
    "Adaptive_Playstyle",
    "Risk_Management",
    "Mind_Games"
]

generated_stats = {
    skill: round(random.uniform(0.0, 20.0), 1)
    for skill in skills
}

print("{")
for k, v in generated_stats.items():
    print(f"    {k:22}: {v},")
print("}")
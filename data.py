import pandas as pd

# Load directly from Hugging Face URL
url = "https://huggingface.co/datasets/open-llm-leaderboard/contents/resolve/main/data/train-00000-of-00001.parquet"
df = pd.read_parquet(url)

# Preview
df.head()

co2_cost = df["CO₂ cost (kg)"]
print(co2_cost)
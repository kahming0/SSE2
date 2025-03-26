import { asyncBufferFromUrl, parquetReadObjects } from 'hyparquet'

const url = 'https://huggingface.co/datasets/open-llm-leaderboard/contents/resolve/main/data/train-00000-of-00001.parquet'
const file = await asyncBufferFromUrl({ url }) // wrap url for async fetching
const data = await parquetReadObjects({file})
console.log(data)
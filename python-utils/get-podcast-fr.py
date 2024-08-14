import feedparser
import uuid
from supabase import create_client, Client

# Supabase 连接设置
url: str = "https://uokyzrkcfnvxshmxalnp.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVva3l6cmtjZm52eHNobXhhbG5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjI1Mzc3NSwiZXhwIjoyMDM3ODI5Nzc1fQ.pMwbz8ds4QRlt1bFITt5PPw4_SRti6Vnf8fjAXG3iIA"
supabase: Client = create_client(url, key)

# 解析 RSS feed
rss_url = "https://anchor.fm/s/8e71168/podcast/rss"
feed = feedparser.parse(rss_url)

# 存储 podcast 信息
podcast_id = str(uuid.uuid4())
podcast_data = {
    "id": podcast_id,
    "title": feed.feed.title,
    "imageurl": feed.feed.image.href if 'image' in feed.feed else None,
    "description": feed.feed.description,
    "author": feed.feed.get('author', None)  # 使用 get 方法以防属性不存在
}

supabase.table("podcasts").insert(podcast_data).execute()

# 存储每集 episode 信息
for entry in feed.entries:
    episode_data = {
        "id": str(uuid.uuid4()),
        "title": entry.title,
        "published_at": entry.published,
        "description": entry.get('summary', None),  # 使用 get 方法以防属性不存在
        "imgurl": entry.get('image', {}).get('href', None),  # 使用嵌套的 get 方法
        "audiourl": entry.enclosures[0].href if entry.enclosures else None,
        "podcast_id": podcast_id
    }
    supabase.table("episodes").insert(episode_data).execute()

print("Podcast and episodes have been stored in the database.")
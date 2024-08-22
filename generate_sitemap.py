import os
from urllib.parse import urljoin

def generate_sitemap(base_url, app_directory):
    urls = []

    # 遍历目录中的所有文件
    for root, _, files in os.walk(app_directory):
        for file in files:
            if file.endswith('.tsx'):
                # 获取相对路径，并将其转换为 URL
                relative_path = os.path.relpath(os.path.join(root, file), app_directory)
                url_path = relative_path.replace(os.sep, '/').replace('/page.tsx', '/').replace('index.tsx', '')
                full_url = urljoin(base_url, url_path)
                urls.append(full_url)

    # 生成 sitemap 文件
    with open('sitemap.xml', 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url in urls:
            f.write(f'  <url>\n    <loc>{url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n')
        f.write('</urlset>\n')

    print(f'Sitemap generated with {len(urls)} URLs.')

if __name__ == "__main__":
    # 将 base_url 替换为你的网站 URL
    base_url = 'https://www.languepod.fun/'
    # 指定 app 目录路径
    app_directory = 'app'

    generate_sitemap(base_url, app_directory)
/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://www.languepod.fun', // 你的网站URL
    generateRobotsTxt: true, // (可选) 是否生成 robots.txt
    sitemapSize: 7000, // (可选) 每个 sitemap 的最大 URL 数量
    changefreq: 'daily', // (可选) 定义 changefreq，默认为 'weekly'
    priority: 0.7, // (可选) 设置所有页面的默认优先级
  };
  
  module.exports = config;
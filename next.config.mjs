// next.config.mjs

// 使用 import 语法引入 dotenv
import dotenv from 'dotenv';

// 配置 dotenv 以加载 .env 文件中的环境变量
dotenv.config();

// 使用 ES Modules 语法导出 Next.js 配置
export default {
  env: {
    GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    PROJECT_ID: process.env.PROJECT_ID,
  },
};
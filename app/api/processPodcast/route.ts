import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import  { localeNames } from '@/lib/i18n'

export async function POST(req: NextRequest) {
  try {
    const {
      audioUrl,
      langName,
      task_id,
      card_id,
      user_id,
      curr_lang,
      interval_minutes,
      max_attempts,
    } = await req.json();

    // 输入验证
    if (!audioUrl || !langName || !task_id || !card_id || !user_id || !curr_lang || !interval_minutes || !max_attempts) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const lang_full_name = localeNames[curr_lang];
    // 配置请求数据
    const data = {
      audioUrl,
      langName,
      task_id,
      card_id,
      user_id,
      lang_full_name,
      interval_minutes,
      max_attempts,
    };

    // 发送 POST 请求到 Flask API
    const response = await axios.post(process.env.FLASK_API_URL || 'http://43.130.53.241:5000/startUploadAndTranscribe', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 设置请求超时时间为 10 秒
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Error processing podcast:', error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.response?.data || 'Failed to process podcast.' }, { status: error.response?.status || 500 });
    } else {
      return NextResponse.json({ error: 'Failed to process podcast.' }, { status: 500 });
    }
  }
}
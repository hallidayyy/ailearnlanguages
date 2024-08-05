import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { Buffer } from 'buffer';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径

// 初始化 Google Cloud Storage 客户端
const storage = new Storage({
  credentials: JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY!, 'base64').toString()),
});

// 从环境变量获取 Google Cloud Storage 存储桶名称
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'forlinguapod';
const TRANSCRIPT_FOLDER = 'transcription-results';

// 导出 POST 方法
export async function POST(req: NextRequest) {
  const { taskid } = await req.json();
  console.log('task id for query: ' + taskid);

  if (!taskid) {
    return NextResponse.json({ error: '需要任务 ID' }, { status: 400 });
  }

  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const filePath = `${TRANSCRIPT_FOLDER}/${taskid}`;
    const file = bucket.file(filePath);

    // 检查文件是否存在
    const [exists] = await file.exists();
    if (exists) {
      console.log('找到转录结果文件，开始读取...');
      const [content] = await file.download();
      const transcriptionResult = content.toString('utf-8');

      console.log('转录结果获取成功');

      // 初始化数据库连接
      const supabase = await getDb();

      // 更新任务状态
      const { error: taskUpdateError, data: updatedTask } = await supabase
        .from('task')
        .update({ status: 'transcribed' })
        .eq('id', taskid) // 假设 taskid 对应于 card_id
        .select('card_id') // 选择 card_id 字段
        .single(); // 仅返回单条记录

      if (taskUpdateError) {
        console.error('更新任务状态时发生错误:', taskUpdateError.message || taskUpdateError);
        return NextResponse.json({ error: '更新任务状态时发生错误。' }, { status: 500 });
      }

      if (!updatedTask) {
        return NextResponse.json({ error: '未找到对应的任务记录' }, { status: 404 });
      }

      const cardId = updatedTask.card_id;

      // 更新 cards 表中的 original 字段
      const { error: cardUpdateError } = await supabase
        .from('cards')
        .update({ original: transcriptionResult })
        .eq('id', cardId);

      if (cardUpdateError) {
        console.error('更新卡片时发生错误:', cardUpdateError.message || cardUpdateError);
        return NextResponse.json({ error: '更新卡片时发生错误。' }, { status: 500 });
      }

      return NextResponse.json({ transcription: transcriptionResult });
    } else {
      console.log('转录结果文件尚未生成');
      return NextResponse.json({ status: 'pending' });
    }
  } catch (error) {
    console.error('获取转录结果时发生错误:', (error as Error).message || error);
    return NextResponse.json({ error: '获取转录结果时发生错误。' }, { status: 500 });
  }
}
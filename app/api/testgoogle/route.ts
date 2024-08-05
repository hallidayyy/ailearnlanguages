import { NextResponse } from 'next/server';
import { uploadAndTranscribe, checkAndGetTranscribeResult } from '@/lib/googlecloudspeech';
import axios from 'axios';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { action, audioUrl, operationName, resultFileName } = await req.json();

    let response;

    switch (action) {
      case 'uploadAndTranscribe':
        if (!audioUrl) {
          return NextResponse.json({ error: 'audioUrl is required' }, { status: 400 });
        }
        response = await uploadAndTranscribe(audioUrl);
        break;
      case 'checkAndGetTranscribeResult':
        if (!resultFileName) {
          return NextResponse.json({ error: 'resultFileName is required' }, { status: 400 });
        }
        response = await checkAndGetTranscribeResult(resultFileName);
        break;
      case 'downloadAudio':
        if (!audioUrl) {
          return NextResponse.json({ error: 'audioUrl is required' }, { status: 400 });
        }
        response = await downloadAudio(audioUrl);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || error }, { status: 500 });
  }
}

async function downloadAudio(audioUrl: string): Promise<string> {
  try {
    const response = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const urlParts = audioUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fileExtension = fileName.split('.').pop();
    const tempFilePath = path.join('/tmp', `temp_audio_${uuidv4()}.${fileExtension}`);

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('文件下载成功');
    return tempFilePath;
  } catch (error) {
    console.error('文件下载过程中发生错误:', (error as Error).message || error);
    throw error;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'File path is required' }, { status: 400 });
  }

  const fileName = path.basename(filePath);

  try {
    const fileStream = fs.createReadStream(filePath);

    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || error }, { status: 500 });
  }
}
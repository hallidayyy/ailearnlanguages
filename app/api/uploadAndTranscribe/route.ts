import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';

// // 从环境变量获取 Google Cloud 客户端凭据
// const googleServiceKey = process.env.GOOGLE_SERVICE_KEY!;
// const credential = JSON.parse(Buffer.from(googleServiceKey, 'base64').toString());

// // 初始化 Google Cloud 客户端
// const storage = new Storage({ credentials: credential });
// const speechClient = new SpeechClient({ credentials: credential });





// 初始化 Google Cloud 客户端
const storage = new Storage();
const speechClient = new SpeechClient();

// 从环境变量获取 Google Cloud Storage 存储桶名称
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'forlinguapod'; // 请替换为你的存储桶名称
const TRANSCRIPT_OUTPUT_BUCKET = process.env.TRANSCRIPT_OUTPUT_BUCKET || 'forlinguapod';

// 导出 POST 方法
export async function POST(req: NextRequest) {
  const { audioUrl, resultFilename, langName } = await req.json();

  console.log("i get langname is:"+langName+audioUrl+resultFilename);


  if (!audioUrl || !resultFilename || !langName) {
    return NextResponse.json({ error: '需要音频 URL 和结果文件名和语言名称' }, { status: 400 });
  }

  try {
    // 下载音频文件到本地临时目录
    const localFilePath = await downloadFile(audioUrl);
    // 上传音频文件到 Google Cloud Storage
    const gcsUri = await uploadFileToGCS(localFilePath, BUCKET_NAME);

    console.log('音频文件上传完成，开始启动 Google Cloud Speech 异步转录...');

    // 配置转录请求
    const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
      encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
      sampleRateHertz: 16000,
      languageCode: langName,
      model: 'default',
    };

    const outputConfig: protos.google.cloud.speech.v1.ITranscriptOutputConfig = {
      gcsUri: `gs://${TRANSCRIPT_OUTPUT_BUCKET}/transcription-results/${resultFilename}`,
    };

    const request: protos.google.cloud.speech.v1.ILongRunningRecognizeRequest = {
      config: config,
      audio: {
        uri: gcsUri,
      },
      outputConfig: outputConfig,
    };

    // 启动转录过程
    const [operation] = await speechClient.longRunningRecognize(request);
    console.log('Google Cloud Speech 异步转录启动完成');

    return NextResponse.json({ operationName: operation.name! });
  } catch (error) {
    console.error('上传或转录过程中发生错误:', (error as Error).message || error);
    return NextResponse.json({ error: '上传或转录过程中发生错误。' }, { status: 500 });
  }
}

/**
 * 从URL下载文件到本地路径
 *
 * @param {string} fileUrl - 要下载的文件的URL
 * @returns {Promise<string>} - 下载文件的本地路径
 */
async function downloadFile(fileUrl: string): Promise<string> {
  try {
    console.log('开始从 URL 下载文件...');
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fileExtension = fileName.split('.').pop();
    const localFilePath = path.join(os.tmpdir(), `downloaded_audio_${uuidv4()}.${fileExtension}`);

    const writer = fs.createWriteStream(localFilePath);
    response.data.pipe(writer);

    return new Promise<string>((resolve, reject) => {
      writer.on('finish', () => resolve(localFilePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('文件下载过程中发生错误:', (error as Error).message || error);
    throw error;
  }
}

/**
 * 将本地文件上传到Google Cloud Storage
 *
 * @param {string} localFilePath - 要上传的文件的本地路径
 * @param {string} bucketName - Google Cloud Storage存储桶的名称
 * @returns {Promise<string>} - 上传文件的GCS URI
 */
async function uploadFileToGCS(localFilePath: string, bucketName: string): Promise<string> {
  try {
    console.log('开始上传文件到 Google Cloud Storage...');
    const fileName = path.basename(localFilePath);
    const fileExtension = fileName.split('.').pop();
    const gcsFileName = `audio-${uuidv4()}.${fileExtension}`;

    console.log(`目标 GCS 文件名: ${gcsFileName}`);

    await storage.bucket(bucketName).upload(localFilePath, {
      destination: gcsFileName,
      metadata: {
        contentType: `audio/${fileExtension}`, // 根据文件类型调整
      },
    });

    console.log('文件上传完成');
    const gcsUri = `gs://${bucketName}/${gcsFileName}`;
    console.log(`文件已上传到: ${gcsUri}`);

    return gcsUri;
  } catch (error) {
    console.error('上传文件过程中发生错误:', (error as Error).message || error);
    throw error;
  }
}
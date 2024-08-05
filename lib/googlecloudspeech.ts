import { Storage } from '@google-cloud/storage';
import { SpeechClient, protos } from '@google-cloud/speech';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Buffer } from 'buffer';

const googleServiceKey = process.env.GOOGLE_SERVICE_KEY!;
const credential = JSON.parse(Buffer.from(googleServiceKey, 'base64').toString());

const storage = new Storage({
    credentials: credential,
});
const speechClient = new SpeechClient({
    credentials: credential,
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'your-bucket-name';
const TRANSCRIPT_OUTPUT_BUCKET = process.env.TRANSCRIPT_OUTPUT_BUCKET || 'your-transcript-output-bucket';

interface TranscriptionResponse {
    operationName: string;
}

interface AudioTranscriptionResult {
    transcription: string;
}

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

async function uploadFileToGCS(localFilePath: string, bucketName: string): Promise<string> {
    try {
        console.log('开始上传文件到 Google Cloud Storage...');
        const fileName = path.basename(localFilePath);
        const fileExtension = fileName.split('.').pop();
        const gcsFileName = `audio-${uuidv4()}.${fileExtension}`;
        console.log(`目标 GCS 文件名: ${gcsFileName}`);

        await storage.bucket(BUCKET_NAME).upload(localFilePath, {
            destination: gcsFileName,
            metadata: {
                contentType: `audio/${fileExtension}`,
            },
        });

        console.log('文件上传完成');
        const gcsUri = `gs://${BUCKET_NAME}/${gcsFileName}`;
        console.log(`文件已上传到: ${gcsUri}`);

        return gcsUri;
    } catch (error) {
        console.error('上传文件过程中发生错误:', (error as Error).message || error);
        throw error;
    }
}
function generateUniqueFileName(): string {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const uniqueId = uuidv4();
    return `transcription-${timestamp}-${uniqueId}.json`;
}

export async function uploadAndTranscribe(audioUrl: string, resultFileName: string): Promise<TranscriptionResponse> {
    try {
        const localFilePath = await downloadFile(audioUrl);
        const gcsUri = await uploadFileToGCS(localFilePath, BUCKET_NAME);

        console.log('音频文件上传完成，开始启动 Google Cloud Speech 异步转录...');

        const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
            encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            model: 'video',
        };

        // 使用传入的文件名参数
        const outputConfig: protos.google.cloud.speech.v1.ITranscriptOutputConfig = {
            gcsUri: `gs://${BUCKET_NAME}/transcription-results/${resultFileName}`,
        };

        const request: protos.google.cloud.speech.v1.ILongRunningRecognizeRequest = {
            config: config,
            audio: {
                uri: gcsUri,
            },
            outputConfig: outputConfig,
        };

        const [operation] = await speechClient.longRunningRecognize(request);
        console.log('Google Cloud Speech 异步转录启动完成');

        return { operationName: operation.name! };
    } catch (error) {
        console.error('上传或转录过程中发生错误:', (error as Error).message || error);
        throw error;
    }
}

export async function getTranscriptionResult(resultFileName: string): Promise<string | null> {
    try {
        const filePath = `transcription-results/${resultFileName}`;
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(filePath);

        // 检查文件是否存在
        const [exists] = await file.exists();
        if (exists) {
            console.log('找到转录结果文件，开始读取...');
            const [content] = await file.download();
            const transcriptionResult = content.toString('utf-8');

            console.log('转录结果获取成功');
            console.log('transcription:', transcriptionResult);
            return transcriptionResult;
        } else {
            console.log('转录结果文件尚未生成');
            return null;
        }
    } catch (error) {
        console.error('获取转录结果时发生错误:', (error as Error).message || error);
        throw error;
    }
}
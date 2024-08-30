import os
import openai # type: ignore
import json

# 设置 API 密钥和 Base URL
api_key = 'sk-1a293ee91cba46a4ae9bc5b689b1c349'
base_url = 'https://api.deepseek.com/beta'

# 创建 OpenAI 客户端实例
client = openai.OpenAI(
    api_key=api_key,
    base_url=base_url,
)

# 系统提示，包含 JSON 输出样例
system_prompt = """
The user is practicing dictation, please provide the differences between the dictation script and the original text, the reasons for these differences, and a summary of the listening skills, and output them in JSON format.

EXAMPLE INPUT: 
Dictation: "hello this is my friend tom, i am andy", Original: "hi, that is my friend tommy, and i am and"

EXAMPLE JSON OUTPUT:
{
    "differences": {
        "difference": [
            {
                "original": "this is my friend tom",
                "wrong": "that is my friend tommy",
                "reason": "Similar pronunciation, confused"
            },
            {
                "original": "i am andy",
                "wrong": "and i am and",
                "reason": "Omitted part of the information"
            }
        ]
    },
    "summary": "Your listening skills are average; you need to improve in pronunciation recognition and information completeness"
}
"""

def main():
    text1 = input("Enter original text: ")
    text2 = input("Enter dictation text: ")
    user_lang = input("Enter user language: ")

    if not text1 or not text2:
        print("Error: Missing text1 or text2")
        return

    try:
        # 用户提示，包含需要解析的文本
        user_prompt = f"dictation is: {text2}. original text is: {text1}. analyze the errors in dictation using {user_lang}."

        # 构建消息列表
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        # 调用模型生成 JSON 输出
        response = client.chat.completions.create(
            model="deepseek-coder",
            messages=messages,
            response_format={
                'type': 'json_object'
            }
        )

        # 解析并打印 JSON 输出
        json_response = json.loads(response.choices[0].message.content)
        print(json.dumps(json_response, indent=4))

    except Exception as e:
        print(f"Error communicating with OpenAI: {e}")

if __name__ == "__main__":
    main()
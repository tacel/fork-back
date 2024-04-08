const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
} = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
  console.log('Request received', req.method, req.path,req);
  next();
});

const port = 3000;
const MODEL_NAME = "gemini-1.0-pro-001";
const API_KEY = ""; // 제미나이 API 키로 대체
const prompt = '﻿전화기 사용법 , 다음의 이미지 url 링크의 내용을 추출해서 참조하고  추출내용에 대해서만 설명해줘 https://kfood751c2c84c6274b5b99e0d8ff758b769165727-staging.s3.amazonaws.com/park_n_forward.jpg'; // 당신의 챗봇에 맞게 프롬프트 변경해주세요

app.post('/generate', async (req, res) => {  
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
        };
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
       const parts = [
            { text: req.body.userInput + prompt } 
        ];
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
        
        const response = result.response;     
        const text = response.text(); 
        res.send({ text: text }); 

     } catch (error) {
        console.error("Error during content generation:", error);
        res.status(500).send({ message: "An error occurred during content generation." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

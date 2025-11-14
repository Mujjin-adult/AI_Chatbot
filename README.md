# AI Chatbot - Spring Boot + React + Groq Llama 3.1

Groq의 Llama 3.1 모델을 사용하는 AI 챗봇 애플리케이션입니다.

## 기술 스택

- **Backend**: Spring Boot 3.3.3 + Spring AI
- **Frontend**: React
- **AI Model**: Groq Llama 3.1-8b-instant
- **Deployment**: Docker & Docker Compose

## 시작하기

### 1. Groq API 키 발급

1. [Groq Console](https://console.groq.com)에 접속
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 API 키 생성

### 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 API 키를 설정합니다:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

또는 docker-compose.yaml 파일에서 직접 환경 변수를 설정할 수 있습니다.

### 3. Docker로 실행

```bash
# 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

### 4. 접속

- **Frontend (React UI)**: http://localhost:3000
- **Backend API**: http://localhost:8080

## API 사용 예시

```bash
# 간단한 메시지 전송
curl "http://localhost:8080/ai/chat/string?message=Hello"

# POST 요청으로 메시지 전송
curl -X POST "http://localhost:8080/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain Spring AI"}'
```

## 프로젝트 구조

```
.
├── spring-boot-ai-chatbot/     # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       └── resources/
│   │           └── application.yaml
│   └── Dockerfile
├── chatbot-ui/                  # React 프론트엔드
│   ├── src/
│   ├── public/
│   └── Dockerfile
└── docker-compose.yaml
```

## 개발 환경에서 실행

### Backend

```bash
cd spring-boot-ai-chatbot
export GROQ_API_KEY=your_api_key_here
./mvnw spring-boot:run
```

### Frontend

```bash
cd chatbot-ui
npm install
npm start
```

## 보안 주의사항

⚠️ **중요**: API 키를 절대 Git에 커밋하지 마세요!

- `.env` 파일은 `.gitignore`에 추가되어 있습니다
- `docker-compose.yaml`에 직접 API 키를 입력한 경우, 해당 파일을 커밋하지 마세요
- 환경 변수를 사용하여 API 키를 관리하세요

## 문제 해결

### Docker 빌드 실패

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### API 키 오류

환경 변수가 제대로 설정되었는지 확인:

```bash
echo $GROQ_API_KEY
```

## 라이선스

MIT License

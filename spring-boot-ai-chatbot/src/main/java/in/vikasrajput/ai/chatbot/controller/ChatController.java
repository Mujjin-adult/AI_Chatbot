package in.vikasrajput.ai.chatbot.controller;

import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final OpenAiChatModel chatModel;

    @Autowired
    public ChatController(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping(value = "/ai/chat", produces = "application/json;charset=UTF-8")
    public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        // 시스템 메시지 추가 - 챗봇의 역할과 행동 방식 정의
        SystemMessage systemMessage = new SystemMessage(
            "당신은 친절하고 전문적인 AI 어시스턴트입니다. " +
            "항상 정확하고 도움이 되는 답변을 제공하며, " +
            "한국어로 자연스럽게 대화합니다. " +
            "모르는 내용은 솔직하게 모른다고 말합니다." +
            "모든 답변은 한국어로 제공합니다." +
            "초보자도 이해할 수 있게 단계별로 설명합니다." +
            "모든 답변의 마지막에는 이모티콘을 추가합니다"
        );
        
        UserMessage userMessage = new UserMessage(message);
        
        // 시스템 메시지와 사용자 메시지를 함께 전달
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
        
        return chatModel.stream(prompt);
    }

    @GetMapping(value = "/ai/chat/string", produces = "text/event-stream;charset=UTF-8")
    public Flux<String> generateString(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        // 시스템 메시지 추가 - 챗봇의 역할과 행동 방식 정의
        SystemMessage systemMessage = new SystemMessage(
            "당신은 친절하고 전문적인 AI 어시스턴트입니다. " +
            "항상 정확하고 도움이 되는 답변을 제공하며, " +
            "한국어로 자연스럽게 대화합니다. " +
            "모르는 내용은 솔직하게 모른다고 말합니다. " +
            "모든 답변은 한국어로 제공합니다. " +
            "초보자도 이해할 수 있게 단계별로 설명합니다. " +
            "모든 답변의 마지막에는 이모티콘을 추가합니다."
        );
        
        UserMessage userMessage = new UserMessage(message);
        
        // 시스템 메시지와 사용자 메시지를 함께 전달
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
        
        // ChatResponse를 String으로 변환 (null 안전 처리)
        return chatModel.stream(prompt)
            .map(response -> {
                try {
                    String content = response.getResult().getOutput().getContent();
                    return (content != null) ? content : "";
                } catch (Exception e) {
                    return "";
                }
            })
            .filter(content -> !content.isEmpty());
    }
}
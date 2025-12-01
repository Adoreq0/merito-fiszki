package com.wsb.meritofiszki.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Question {
    @SerializedName("question_id")
    private int questionId;
    private String content;
    private Integer category; // Changed to Integer to reflect Optional[int] from API
    private List<Answer> answers;

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    // Helper method to get the index of the correct answer
    public int getCorrectAnswerIndex() {
        if (answers != null) {
            for (int i = 0; i < answers.size(); i++) {
                if (answers.get(i).isCorrect()) {
                    return i;
                }
            }
        }
        return -1; // No correct answer found
    }
}

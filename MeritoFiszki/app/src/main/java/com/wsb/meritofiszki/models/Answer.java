package com.wsb.meritofiszki.models;

import com.google.gson.annotations.SerializedName;

public class Answer {
    @SerializedName("answer_id")
    private int answerId;
    private String content;
    @SerializedName("is_correct")
    private boolean isCorrect;

    public int getAnswerId() {
        return answerId;
    }

    public void setAnswerId(int answerId) {
        this.answerId = answerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}

package com.wsb.meritofiszki.api;

import com.wsb.meritofiszki.models.Question;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

public interface QuizApiService {
    @GET("questions_with_answers/")
    Call<List<Question>> getAllQuestionsWithAnswers();
}

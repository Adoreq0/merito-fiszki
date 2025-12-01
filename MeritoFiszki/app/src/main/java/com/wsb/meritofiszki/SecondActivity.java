package com.wsb.meritofiszki;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.RadioButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.wsb.meritofiszki.api.QuizApiService;
import com.wsb.meritofiszki.api.RetrofitClient;
import com.wsb.meritofiszki.databinding.ActivitySecondBinding;
import com.wsb.meritofiszki.models.Answer;
import com.wsb.meritofiszki.models.Question;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SecondActivity extends AppCompatActivity {

    private static final String TAG = "SecondActivity";

    private ActivitySecondBinding binding;
    private List<Question> questions;
    private int currentQuestionIndex = 0;
    private int score = 0;
    private boolean isAnswered = false; // To prevent multiple answers

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySecondBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        fetchQuestions();

        binding.submit.setOnClickListener(v -> {
            if (!isAnswered) {
                checkAnswer();
            } else {
                nextQuestion();
            }
        });
    }

    private void fetchQuestions() {
        QuizApiService apiService = RetrofitClient.getClient().create(QuizApiService.class);
        Call<List<Question>> call = apiService.getAllQuestionsWithAnswers();

        call.enqueue(new Callback<List<Question>>() {
            @Override
            public void onResponse(Call<List<Question>> call, Response<List<Question>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    questions = response.body();
                    if (!questions.isEmpty()) {
                        displayQuestion();
                        Log.d(TAG, "Questions fetched successfully: " + questions.size());
                    } else {
                        Toast.makeText(SecondActivity.this, "Brak pytań do wyświetlenia.", Toast.LENGTH_SHORT).show();
                        Log.d(TAG, "No questions in the response body.");
                    }
                } else {
                    Toast.makeText(SecondActivity.this, "Błąd pobierania pytań: " + response.message(), Toast.LENGTH_LONG).show();
                    Log.e(TAG, "Error fetching questions: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<List<Question>> call, Throwable t) {
                Toast.makeText(SecondActivity.this, "Błąd sieci: " + t.getMessage(), Toast.LENGTH_LONG).show();
                Log.e(TAG, "Network error fetching questions", t);
            }
        });
    }

    private void displayQuestion() {
        if (questions == null || questions.isEmpty() || currentQuestionIndex >= questions.size()) {
            Log.e(TAG, "displayQuestion called with invalid state.");
            return;
        }

        Question currentQuestion = questions.get(currentQuestionIndex);

        binding.questionTitle.setText(String.format("Pytanie %d", currentQuestionIndex + 1));
        binding.question.setText(currentQuestion.getContent());

        // Clear any previous selection
        binding.radioGroup.clearCheck();
        isAnswered = false;

        // Re-enable radio buttons and reset backgrounds
        for (int i = 0; i < binding.radioGroup.getChildCount(); i++) {
            RadioButton rb = (RadioButton) binding.radioGroup.getChildAt(i);
            rb.setEnabled(true);
            rb.setBackgroundResource(R.drawable.answerbutton); // Reset to default background
        }


        List<Answer> answers = currentQuestion.getAnswers();
        if (answers != null && answers.size() == 4) { // Assuming exactly 4 answers
            binding.a1.setText(answers.get(0).getContent());
            binding.a2.setText(answers.get(1).getContent());
            binding.a3.setText(answers.get(2).getContent());
            binding.a4.setText(answers.get(3).getContent());
        } else {
            Log.e(TAG, "Invalid number of answers for question ID: " + currentQuestion.getQuestionId());
            // Handle error or display message
        }

        updateProgressBar();
        updateSubmitButtonText();
    }

    private void checkAnswer() {
        int selectedId = binding.radioGroup.getCheckedRadioButtonId();
        if (selectedId == -1) {
            Toast.makeText(SecondActivity.this, "Proszę wybrać opcję", Toast.LENGTH_SHORT).show();
            return;
        }

        isAnswered = true;
        RadioButton selectedRadioButton = findViewById(selectedId);
        int selectedAnswerIndex = -1;
        if (selectedRadioButton == binding.a1) selectedAnswerIndex = 0;
        else if (selectedRadioButton == binding.a2) selectedAnswerIndex = 1;
        else if (selectedRadioButton == binding.a3) selectedAnswerIndex = 2;
        else if (selectedRadioButton == binding.a4) selectedAnswerIndex = 3;

        Question currentQuestion = questions.get(currentQuestionIndex);
        int correctAnswerIndex = currentQuestion.getCorrectAnswerIndex();

        if (selectedAnswerIndex != -1 && selectedAnswerIndex == correctAnswerIndex) {
            score++;
            Toast.makeText(SecondActivity.this, "Poprawna odpowiedź! :)", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(SecondActivity.this, "Niepoprawna odpowiedź! :(", Toast.LENGTH_SHORT).show();
        }
        updateSubmitButtonText();
        highlightAnswers(selectedAnswerIndex, correctAnswerIndex);
    }

    private void nextQuestion() {
        // ... (existing code)
    }

    // ... (existing methods)

    private void highlightAnswers(int selectedAnswerIndex, int correctAnswerIndex) {
        RadioButton selectedRadioButton = null;
        RadioButton correctRadioButton = null;

        if (binding.a1.getId() == binding.radioGroup.getCheckedRadioButtonId()) selectedRadioButton = binding.a1;
        else if (binding.a2.getId() == binding.radioGroup.getCheckedRadioButtonId()) selectedRadioButton = binding.a2;
        else if (binding.a3.getId() == binding.radioGroup.getCheckedRadioButtonId()) selectedRadioButton = binding.a3;
        else if (binding.a4.getId() == binding.radioGroup.getCheckedRadioButtonId()) selectedRadioButton = binding.a4;

        // Find the correct answer radio button
        if (correctAnswerIndex == 0) correctRadioButton = binding.a1;
        else if (correctAnswerIndex == 1) correctRadioButton = binding.a2;
        else if (correctAnswerIndex == 2) correctRadioButton = binding.a3;
        else if (correctAnswerIndex == 3) correctRadioButton = binding.a4;

        if (selectedRadioButton != null) {
            if (selectedAnswerIndex == correctAnswerIndex) {
                selectedRadioButton.setBackgroundResource(R.drawable.answer_correct);
            } else {
                selectedRadioButton.setBackgroundResource(R.drawable.answer_incorrect);
                if (correctRadioButton != null) {
                    correctRadioButton.setBackgroundResource(R.drawable.answer_correct);
                }
            }
        } else {
            // This case should ideally not be reached if a radio button is always selected
            if (correctRadioButton != null) {
                correctRadioButton.setBackgroundResource(R.drawable.answer_correct);
            }
        }
        // Disable radio buttons after answer
        for (int i = 0; i < binding.radioGroup.getChildCount(); i++) {
            binding.radioGroup.getChildAt(i).setEnabled(false);
        }
    }
}

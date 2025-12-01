package com.wsb.meritofiszki;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import com.wsb.meritofiszki.databinding.ActivityThirdBinding;

public class ThirdActivity extends AppCompatActivity {

    private ActivityThirdBinding binding;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityThirdBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        int score = getIntent().getIntExtra("score", 0);
        int totalQuestions = getIntent().getIntExtra("totalQuestions", 0);

        displayResults(score, totalQuestions);

        binding.buttonStart.setOnClickListener(v -> {
            Intent intent = new Intent(ThirdActivity.this, MainActivity.class);
            startActivity(intent);
            finish(); // Finish this activity
        });
    }

    private void displayResults(int score, int totalQuestions) {
        // Display score
        binding.textView3.setText(String.format("Poprawne odpowiedzi:\n %d/%d", score, totalQuestions));

        // Calculate percentage
        double percentage = (totalQuestions > 0) ? ((double) score / totalQuestions) * 100 : 0;

        // Display message based on percentage
        binding.textView2.setText(getMessage(percentage));

        // Update ProgressBar and TextView with percentage
        binding.scoreProgressBar.setProgress((int) percentage);
        binding.percentageTextView.setText(String.format("%.0f%%", percentage));
    }

    private String getMessage(double percentage) {
        if (percentage == 100) {
            return "Brawo! Perfekcyjny wynik! 🎉";
        } else if (percentage >= 80) {
            return "Świetna robota! 👏";
        } else if (percentage >= 60) {
            return "Dobry wynik! 👍";
        } else {
            return "Spróbuj jeszcze raz! 💪";
        }
    }
}
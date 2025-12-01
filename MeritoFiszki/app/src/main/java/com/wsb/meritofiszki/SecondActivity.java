package com.wsb.meritofiszki;

import android.os.Bundle;
import android.widget.RadioButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import com.wsb.meritofiszki.databinding.ActivitySecondBinding;

public class SecondActivity extends AppCompatActivity {

    private ActivitySecondBinding binding;
    private int questionNumber = 1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySecondBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.submit.setOnClickListener(v-> {
            int selectedId = binding.radioGroup.getCheckedRadioButtonId();
            if(selectedId != -1){
                RadioButton selectedRadioButton = findViewById(selectedId);
                String selectedOption = selectedRadioButton.getText().toString();
                Toast.makeText(SecondActivity.this, "Wybrana opcja: " + selectedOption, Toast.LENGTH_SHORT).show();
                updateProgressBar();
            }else{
                Toast.makeText(SecondActivity.this, "Proszę wybrać opcję", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateProgressBar(){
        int progress = (questionNumber * 100)/5;
        binding.progressBar.setProgress(progress);

        if(questionNumber == 5){
            Toast.makeText(this, "Quiz zakończony!", Toast.LENGTH_SHORT).show();
        }else{
            questionNumber++;
        }
    }
}

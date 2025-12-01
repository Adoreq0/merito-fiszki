package com.wsb.meritofiszki;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.wsb.meritofiszki.databinding.ActivityThirdBinding;

public class ThirdActivity extends AppCompatActivity {

    private ActivityThirdBinding binding;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityThirdBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }
}
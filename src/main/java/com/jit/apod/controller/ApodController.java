package com.jit.apod.controller;

import com.jit.apod.model.ApodResponse;
import com.jit.apod.service.ApodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend to access if running on different port (not needed here but good practice)
public class ApodController {

    @Autowired
    private ApodService service;

    // Endpoint: GET /api/today
    @GetMapping("/today")
    public ApodResponse getToday() {
        String today = LocalDate.now().toString();
        return service.getApodForDate(today);
    }

    // Endpoint: GET /api/date?val=YYYY-MM-DD
    @GetMapping("/date")
    public ApodResponse getByDate(@RequestParam("val") String date) {
        return service.getApodForDate(date);
    }

    // Endpoint: GET /api/gallery
    @GetMapping("/gallery")
    public ApodResponse[] getGallery() {
        return service.getRecentApods();
    }
}

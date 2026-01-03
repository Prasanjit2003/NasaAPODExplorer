package com.jit.apod.controller;

import com.jit.apod.model.ApodResponse;
import com.jit.apod.service.ApodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApodController {

    @Autowired
    private ApodService service;

    @GetMapping("/today")
    public ApodResponse getToday() {
        String today = LocalDate.now().toString();
        return service.getApodForDate(today);
    }

    @GetMapping("/date")
    public ApodResponse getByDate(@RequestParam("val") String date) {
        return service.getApodForDate(date);
    }

    @GetMapping("/gallery")
    public ApodResponse[] getGallery() {
        return service.getRecentApods();
    }
}

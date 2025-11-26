package com.jit.apod.service;

import com.jit.apod.model.ApodResponse;
import com.jit.apod.util.SimpleLRUCache;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;

/**
 * COMPONENT: SERVICE LAYER
 * Handles business logic, communicating with external NASA APIs,
 * and managing the cache.
 */
@Service
public class ApodService {

    // SECURITY NOTE: In production, keys should come from System.getenv().
    // We fall back to the hardcoded key for local Eclipse testing ease.
    private static final String DEFAULT_KEY = "sDO39CdMRbYJo4xa2hnh3C19Fqubnkohd13PUxDT";
    private static final String BASE_URL = "https://api.nasa.gov/planetary/apod";
    
    // Cache: Max 50 items, Expiry 1 hour (3600000ms).
    private final SimpleLRUCache<String, Object> cache = new SimpleLRUCache<>(50, 3600000);
    private final RestTemplate restTemplate = new RestTemplate();

    private String getApiKey() {
        String envKey = System.getenv("NASA_API_KEY");
        return (envKey != null && !envKey.isEmpty()) ? envKey : DEFAULT_KEY;
    }

    public ApodResponse getApodForDate(String date) {
        String cacheKey = "date:" + date;
        ApodResponse cached = (ApodResponse) cache.get(cacheKey);
        if (cached != null) {
            System.out.println("Cache Hit for date: " + date);
            return cached;
        }

        System.out.println("Cache miss. Fetching from NASA for: " + date);
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("api_key", getApiKey())
                .queryParam("date", date)
                .toUriString();

        try {
            ApodResponse response = restTemplate.getForObject(url, ApodResponse.class);
            if (response != null) cache.put(cacheKey, response);
            return response;
        } catch (Exception e) {
            System.err.println("Error fetching data: " + e.getMessage());
            // Return a dummy error object so frontend doesn't crash
            return null;
        }
    }

    public ApodResponse[] getRecentApods() {
        // TIMEZONE FIX: Use 'yesterday' as the anchor to prevent "Date must be between..." errors
        // if the client is ahead of NASA's server time (e.g., Asia vs US).
        LocalDate safeEnd = LocalDate.now().minusDays(1);
        String endDate = safeEnd.toString();
        String startDate = safeEnd.minusDays(11).toString(); // Last 12 days

        String cacheKey = "gallery:" + endDate; 
        ApodResponse[] cached = (ApodResponse[]) cache.get(cacheKey);
        if (cached != null) return cached;

        System.out.println("Fetching Gallery from " + startDate + " to " + endDate);

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("api_key", getApiKey())
                .queryParam("start_date", startDate)
                .queryParam("end_date", endDate) // Explicitly set end_date
                .toUriString();

        try {
            ApodResponse[] response = restTemplate.getForObject(url, ApodResponse[].class);
            if (response != null) cache.put(cacheKey, response);
            return response;
        } catch (Exception e) {
            System.err.println("Gallery Fetch Error: " + e.getMessage());
            return new ApodResponse[0];
        }
    }
}
package com.loja.central.loja_central.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceRedis {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // Armazena o Refresh Token no Redis com o e-mail como chave
    public void storeRefreshToken(String refreshToken, String email, long expirationTime) {
        redisTemplate.opsForValue().set(refreshToken + ":refresh", email, expirationTime, TimeUnit.MILLISECONDS);
    }

    // Armazena o Access Token no Redis com o e-mail como chave
    public void storeAccessToken(String accessToken, String email, long expirationTime) {
        redisTemplate.opsForValue().set(accessToken + ":access", email, expirationTime, TimeUnit.MILLISECONDS);
    }

    // Verifica se o Refresh Token está armazenado
    public String getRefreshToken(String token) {
        return redisTemplate.opsForValue().get(token + ":refresh");
    }

    // Verifica se o Access Token está armazenado
    public String getAccessToken(String token) {
        return redisTemplate.opsForValue().get(token + ":access");
    }

    // Revoga o Refresh Token e o Access Token ao fazer logout
    public void revokeTokens(String token, String refreshToken) {
        redisTemplate.delete(token + ":access");
        redisTemplate.delete(refreshToken + ":refresh");
    }

    // Verifica se o Access Token foi revogado ou não
    public boolean hasAccessToken(String token) {
        boolean result = redisTemplate.hasKey(token + ":access");
        return result;
    }

    // Verifica se o Refresh Token foi revogado ou não
    public boolean hasRefreshToken(String token) {
        boolean result = redisTemplate.hasKey(token + ":refresh");
        return result; 
    }
}

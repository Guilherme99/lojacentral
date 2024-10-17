package com.loja.central.loja_central.config.log;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuditingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(AuditingInterceptor.class);

    private static final List<String> MASKED_PARAMETERS = Arrays.asList("password", "token", "creditCard");

    private final String LOCALHOST_IPV4 = "127.0.0.1";
    private final String LOCALHOST_IPV6 = "0:0:0:0:0:0:0:1";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String clientIpAddress = getClientIpAddress(request);

        String maskedQueryString = maskSensitiveParameters(request.getQueryString());

        logger.info("Requisição recebida: {} {}{} - IP: {}", request.getMethod(), request.getRequestURI(),
                maskedQueryString, clientIpAddress);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) {

        int statusCode = response.getStatus();

        if (HttpStatus.valueOf(statusCode).is2xxSuccessful()) {
            logger.info("Requisição bem-sucedida: {} {}", request.getMethod(), request.getRequestURI());
        } else {
            logger.warn("Requisição com status diferente de 2xx: {} {} - Status: {}", request.getMethod(),
                    request.getRequestURI(), statusCode);
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            Exception ex) {

        if (ex != null) {
            logger.error("Erro durante o processamento da requisição", ex);
        }
    }

    private String maskSensitiveParameters(String queryString) {
        if (queryString != null) {
            List<String> parameters = Arrays.asList(queryString.split("&"));
            List<String> maskedParameters = parameters.stream()
                    .map(parameter -> maskParameter(parameter))
                    .collect(Collectors.toList());
            return "?" + String.join("&", maskedParameters);
        }
        return "";
    }

    private String maskParameter(String parameter) {
        String[] parts = parameter.split("=");
        if (parts.length == 2) {
            String paramName = parts[0];
            String paramValue = parts[1];
            if (MASKED_PARAMETERS.contains(paramName.toLowerCase())) {
                return paramName + "=********";
            }
            return parameter;
        }
        return parameter;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (StringUtils.isEmpty(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }

        if (StringUtils.isEmpty(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }

        if (StringUtils.isEmpty(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (LOCALHOST_IPV4.equals(ipAddress) || LOCALHOST_IPV6.equals(ipAddress)) {
                try {
                    InetAddress inetAddress = InetAddress.getLocalHost();
                    ipAddress = inetAddress.getHostAddress();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
            }
        }

        if (!StringUtils.isEmpty(ipAddress)
                && ipAddress.length() > 15
                && ipAddress.indexOf(",") > 0) {
            ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
        }

        return ipAddress;
    }
}
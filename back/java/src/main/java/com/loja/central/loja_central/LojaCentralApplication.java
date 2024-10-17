package com.loja.central.loja_central;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.loja.central")
public class LojaCentralApplication {

	public static void main(String[] args) {
		SpringApplication.run(LojaCentralApplication.class, args);
	}

}

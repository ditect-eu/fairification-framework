package eu.ditect.etl.etlservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableKafka
@EnableScheduling
@SpringBootApplication
public class EtlServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(EtlServiceApplication.class, args);
	}
}

package eu.ditect.etl.etlservice.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.*;

@Data
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "csv")
public class CsvConfig {
    private Path folderPath;
    private char delimiter;
    private char quote;

    @Bean
    public WatchService watchService() {
        log.debug("MONITORING_FOLDER: {}", folderPath);
        WatchService watchService = null;
        try {
            watchService = FileSystems.getDefault().newWatchService();
            if (!Files.isDirectory(folderPath)) {
                throw new RuntimeException("incorrect monitoring folder: " + folderPath);
            }

            folderPath.register(
                    watchService,
                    StandardWatchEventKinds.ENTRY_DELETE,
                    StandardWatchEventKinds.ENTRY_MODIFY,
                    StandardWatchEventKinds.ENTRY_CREATE
            );
        } catch (IOException e) {
            log.error("exception for watch service creation:", e);
        }
        return watchService;
    }
}
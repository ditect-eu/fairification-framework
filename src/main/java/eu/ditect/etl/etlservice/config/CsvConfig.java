package eu.ditect.etl.etlservice.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.*;

@Data
@Slf4j
public class CsvConfig {
    private Path folderPath;
    private char delimiter;
    private char quote;
    private WatchService watchService;

    public void initializeWatchService(){
        log.debug("MONITORING_FOLDER: {}", folderPath);
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
    }

    public WatchService getWatchService(){
        return null;
    }
}
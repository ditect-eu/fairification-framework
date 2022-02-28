package eu.ditect.etl.etlservice.service;

import com.opencsv.*;
import eu.ditect.etl.etlservice.config.CsvCollectionConfig;
import eu.ditect.etl.etlservice.config.CsvConfig;
import eu.ditect.etl.etlservice.web.dto.SensorDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class CsvService {
    public static final String CSV = ".csv";
    private CsvCollectionConfig csvCollectionConfig;
    private StreamingService streamingService;
    private MappingService mappingService;

    public CsvService(CsvCollectionConfig csvCollectionConfig,
        StreamingService streamingService, MappingService mappingService) {
        this.csvCollectionConfig = csvCollectionConfig;
        this.streamingService = streamingService;
        this.mappingService = mappingService;
    }

    @PostConstruct
    public void loadExistingCsvs() {
        log.info("Loading csvs.");
        for(CsvConfig csvConfig : csvCollectionConfig.getCsvConfigList()) {
            Path folderPath = csvConfig.getFolderPath();
            try (Stream<Path> csvFileStream = Files.list(folderPath)) {
                Set<File> csvFiles = csvFileStream.filter(file -> !Files.isDirectory(file))
                    .map(Path::toFile)
                    .collect(Collectors.toSet());
                for (File csvFile : csvFiles) {
                    processCsv(csvFile, csvConfig.getQuote(), csvConfig.getDelimiter());
                }
            } catch (IOException e) {
                log.error("Unable to list files for CSV folder: {}", csvConfig.getFolderPath(), e);
            }
        }
    }

    @Async
//    @PostConstruct
    public void launchMonitoring() {
        for(CsvConfig csvConfig : csvCollectionConfig.getCsvConfigList()) {
            WatchService watchService = csvConfig.getWatchService();
            log.info("START_MONITORING");
            try {
                WatchKey key;
                while ((key = watchService.take()) != null) {
                    for (WatchEvent<?> event : key.pollEvents()) {
                        log.debug("Event kind: {}; File affected: {}", event.kind(),
                            event.context());
                        WatchEvent<Path> pathWatchEvent = ((WatchEvent<Path>) event);
                        Path contextPath = pathWatchEvent.context();
                        if (event.kind() == StandardWatchEventKinds.ENTRY_CREATE && contextPath
                            .endsWith(CSV)) {
                            try {
                                processCsv(contextPath.toFile(), csvConfig.getQuote(), csvConfig.getDelimiter());
                            } catch (IOException e) {
                                log.error("Unable to read csv for path: {}", contextPath, e);
                            }
                            key.reset();
                        }
                    }
                }
            } catch (InterruptedException e) {
                log.warn("interrupted exception for monitoring service");
            }
        }
    }

    private void processCsv(File csvFile, char quote, char delimiter) throws IOException {
        log.info("processing csv file: {}", csvFile);
        List<SensorDto> sensorDtos = parseCsv(csvFile, quote, delimiter);
        List<String> jsonLdList = sensorDtos.stream()
                .map(sensorDto -> mappingService.mapToJsonLd(sensorDto))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        for(String jsonLd : jsonLdList){
            streamingService.streamJsonLd(jsonLd);
        }
    }

    private List<SensorDto> parseCsv(File file, char quote, char delimiter) throws IOException {
        log.info("Parsing CSV for file: {}", file);
        List<SensorDto> sensorDtos = new ArrayList<>();
        CSVParser csvParser = new CSVParserBuilder()
                .withQuoteChar(quote)
                .withSeparator(delimiter).build();
        CSVReader reader = new CSVReaderHeaderAwareBuilder(new FileReader(file)).withCSVParser(csvParser).build();
        for (String[] dataEntry : reader) {
            SensorDto sensorDto = new SensorDto();
            sensorDto.setIdentifier(dataEntry[0]);
            sensorDto.setData(Arrays.copyOfRange(dataEntry,
                    1,
                    dataEntry.length));
            sensorDtos.add(sensorDto);
        }
        return sensorDtos;
    }

    @PreDestroy
    public void stopMonitoring() {
        log.info("STOP_MONITORING");
        for(CsvConfig csvConfig : csvCollectionConfig.getCsvConfigList()){
            WatchService watchService = csvConfig.getWatchService();
            if (watchService != null) {
                try {
                    watchService.close();
                } catch (IOException e) {
                    log.error("exception while closing the monitoring service");
                }
            }
        }
    }
}

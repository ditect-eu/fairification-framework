package eu.ditect.etl.etlservice.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Slf4j
@Service
public class StreamingService {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void streamJsonLd(String jsonLd) {
        //TODO: use identifier instead of whole object.
        log.info("Streaming data for json-ld: {}", jsonLd);
        kafkaTemplate.send("sensordata", jsonLd);
    }

    /**
     * Example of how to send binaries later on
     * @param metadata metadata to send with the file
     * @param file file to transfer
     * @throws IOException thrown when unable to read file from bytes
     */
    public void sendBinary(String metadata, File file) throws IOException {
        ProducerRecord<String, byte[]> kafkaRecord = new ProducerRecord<>("sensordata",
                FileUtils.readFileToByteArray(file));
    }
}

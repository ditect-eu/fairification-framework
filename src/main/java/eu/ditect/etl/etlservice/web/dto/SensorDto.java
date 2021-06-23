package eu.ditect.etl.etlservice.web.dto;

import lombok.Data;

import java.util.Map;

@Data
public class SensorDto {
    private String identifier;
    private String[] data;
}

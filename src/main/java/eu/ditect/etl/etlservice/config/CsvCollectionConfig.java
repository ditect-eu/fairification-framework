package eu.ditect.etl.etlservice.config;

import java.util.List;
import javax.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "csv")
public class CsvCollectionConfig {
  private List<CsvConfig> csvConfigList;

  @PostConstruct
  public void initializeWatchServices(){
    for(CsvConfig csvConfig : csvConfigList){
      csvConfig.initializeWatchService();
    }
  }
}

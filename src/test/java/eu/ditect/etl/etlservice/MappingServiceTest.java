package eu.ditect.etl.etlservice;

import eu.ditect.etl.etlservice.service.MappingService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = EtlServiceApplication.class)
@ContextConfiguration
public class MappingServiceTest {
    @Autowired
    private MappingService mappingService;

    @Test
    public void test(){
        mappingService.example();
    }
}
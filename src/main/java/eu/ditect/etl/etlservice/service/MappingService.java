package eu.ditect.etl.etlservice.service;

import be.ugent.rml.Executor;
import be.ugent.rml.Utils;
import be.ugent.rml.functions.FunctionLoader;
import be.ugent.rml.functions.lib.IDLabFunctions;
import be.ugent.rml.records.RecordsFactory;
import be.ugent.rml.store.QuadStore;
import be.ugent.rml.store.QuadStoreFactory;
import be.ugent.rml.store.RDF4JStore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jsonldjava.core.JsonLdOptions;
import com.github.jsonldjava.core.JsonLdProcessor;
import com.github.jsonldjava.utils.JsonUtils;
import eu.ditect.etl.etlservice.config.MappingConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.eclipse.rdf4j.rio.RDFFormat;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class MappingService {
    private MappingConfig mappingConfiguration;

    public MappingService(MappingConfig mappingConfiguration) {
        this.mappingConfiguration = mappingConfiguration;
    }

    public String mapToJsonLd(Object sensorDto) {
        ObjectMapper objectMapper = new ObjectMapper();
        Object jsonObject;
        try {
            String sensorDtoString = objectMapper.writeValueAsString(sensorDto);
            jsonObject = JsonUtils.fromString(sensorDtoString);
            Map context = new HashMap();
            JsonLdOptions options = new JsonLdOptions();
            Object compact = JsonLdProcessor.compact(jsonObject, context, options);
            List<Object> expand = JsonLdProcessor.expand(jsonObject);
            String toPrettyString = JsonUtils.toPrettyString(jsonObject);
            return toPrettyString;
        } catch (IOException e) {
            log.error("Unable to convert {} to JSON-LD", sensorDto, e);
            return null;
        }
    }

    /**
     * Example of how to incorporate mappings to create JSON-LD in the future.
     */
    public void example() {
        try {
            String mapPath = mappingConfiguration.getMappingFile().toString();
            File mappingFile = new File(mapPath);

            InputStream fileStream = new FileInputStream(mappingFile);
            InputStream sourceStream = IOUtils.toInputStream("@prefix ql: <http://semweb.mmlab.be/ns/ql#>.\n" +
                    "@prefix rml: <http://semweb.mmlab.be/ns/rml#>." +
                    "@prefix map: <http://mapping.example.com/>."
                    + "map:source_000 a rml:LogicalSource;\n" +
                    "rml:source \"/Users/thendriks/projects/ditect/csvs/convertedenose.csv\";\n" +
                    "rml:referenceFormulation ql:CSV.", StandardCharsets.UTF_8);

            QuadStore rmlStore = QuadStoreFactory.read(fileStream);
            rmlStore.read(sourceStream, "", RDFFormat.TURTLE);

            RecordsFactory factory = new RecordsFactory(mappingFile.getParent());

            Map<String, Class> libraryMap = new HashMap<>();
            libraryMap.put("IDLabFunctions", IDLabFunctions.class);

            FunctionLoader functionLoader = new FunctionLoader(null, libraryMap);

            QuadStore outputStore = new RDF4JStore();

            Executor executor = new Executor(rmlStore, factory, functionLoader, outputStore, Utils.getBaseDirectiveTurtle(fileStream));

            QuadStore result = executor.execute(null);

            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(System.out));
            result.write(out, "turtle");
            out.close();
        } catch (Exception e) {
            log.error("unable to map.", e);
        }
    }
}
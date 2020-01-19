package com.smart_start.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.smart_start.services.ConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class IndexController {

    private static final String JSON_CONFIGURATION_VERSION = "29";
    private Map<LocalDateTime, String> map = new ConcurrentHashMap<>();
    private final static Logger logger = LoggerFactory.getLogger(IndexController.class);

    @Resource
    private ConfigurationService configurationService;

    @RequestMapping("/test/{lessonId}")
    public String index(@PathVariable String lessonId) {
        if (configurationService.hasJsonConfig(lessonId)) {
            return "index";
        } else {
            return "error/404";
        }
    }

    @RequestMapping(value = "/tester/config/{lessonId}", method = GET, produces = "application/json")
    @ResponseBody
    public ResponseEntity<String> getConfigForTester(@PathVariable String lessonId) {
        return Optional.ofNullable(configurationService.getJsonConfig(lessonId))
                .map(JsonNode::toString)
                .map(config -> new ResponseEntity<>(config, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping("/version")
    @ResponseBody
    public String version() {
        return JSON_CONFIGURATION_VERSION;
    }

    @RequestMapping(value = "/saveID/{id}", method = GET, produces = "application/json")
    @ResponseBody
    public String saveId(@PathVariable String id) {
        LocalDateTime now = LocalDateTime.now();
        logger.info("Time: " + now + " Id: " +  id);
        map.put(now, id);
        return id;
    }


    @RequestMapping(value = "/saveID", method = GET, produces = "application/json")
    public ResponseEntity<Map<LocalDateTime, String>> saveId() {
        return new ResponseEntity<>(map, HttpStatus.OK);

    }

}

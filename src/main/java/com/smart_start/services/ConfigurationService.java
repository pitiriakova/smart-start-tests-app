package com.smart_start.services;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Created by Denis Pitiriakov on 1/25/2018.
 */
public interface ConfigurationService {

	boolean hasJsonConfig(String fileName);

	JsonNode getJsonConfig(String fileName);

}

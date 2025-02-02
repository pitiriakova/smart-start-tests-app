package com.smart_start.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smart_start.services.ConfigurationService;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

/**
 * Created by Denis Pitiriakov on 1/24/2018.
 */
@Service
public class ConfigurationServiceImpl implements ConfigurationService {

	private final static Logger LOGGER = LoggerFactory.getLogger(ConfigurationServiceImpl.class);
	private final static String CONFIG_PATH = "/static/config/%s.json";
	private final static ObjectMapper JSON_MAPPER = new ObjectMapper();

	private final Map<String, JsonNode> configMap = new HashMap<>();

	@PostConstruct
	public void init() {
		IntStream.range(1, 101)
				.forEach(index -> {
							JsonNode configFile = readConfigFile(String.format(CONFIG_PATH, index));
							if (configFile != null) {
								String hash = HASHES[index - 1];
								configMap.put(hash, configFile);
							}
						}
				);

		LOGGER.info("Found {} config files with names:", configMap.size());

		for (int i = 0; i < configMap.size(); i++) {
			LOGGER.info(String.format("%2s) -> %s", i + 1, HASHES[i]));
		}
	}

	@Override
	public boolean hasJsonConfig(String fileName) {
		return configMap.containsKey(fileName);
	}

	@Override
	public JsonNode getJsonConfig(String fileName) {
		return configMap.get(fileName);
	}

	private static JsonNode readConfigFile(String fileName) {
		InputStream inputStream = ConfigurationServiceImpl.class.getResourceAsStream(fileName);
		if (inputStream == null) {
			return null;
		}
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8.name()))) {
			String config = IOUtils.toString(reader);
			return JSON_MAPPER.readTree(config);
		} catch (IOException e) {
			return null;
		}
	}

	/**
	 * Generated by:
	 * private String generateRandomHash() {
	 *   Random r = new Random();
	 *   String result = "";
	 *   for (int i = 0; i < 8; i++) {
	 *     char c = (char) (r.nextInt(26) + 'a');
	 *     result += c;
	 *   }
	 *   return result;
	 * }
	 */
	private static final String[] HASHES = {
			"aydzrrlv",
			"urzjclfd",
			"bctfglvb",
			"jbjkwocb",
			"shbpwgiq",
			"uzzuhozg",
			"mjgzlcdv",
			"kxshwirp",
			"zstjxwld",
			"mpfumibz",
			"wnkcbxgz",
			"ctcjxozb",
			"txovjmrh",
			"tcjepofh",
			"yfolpaxb",
			"wzlmcdyn",
			"gvcfjtkr",
			"kqacjcya",
			"qwdsuyxa",
			"qhpopues",
			"tqbkjqeg",
			"sosvdnmd",
			"lfwzahtk",
			"dmufbjrz",
			"fdxhlaqs",
			"bkgclrla",
			"falftnuu",
			"apeepafi",
			"hizheyxm",
			"fnktdnmb",
			"iywkahdx",
			"oufeuwhp",
			"nlryxswf",
			"lsfngzjc",
			"kssbcgqc",
			"ytnifped",
			"qxxshcvh",
			"wsfgsorj",
			"nuuofonp",
			"bfzylpfy",
			"vtpdpkdk",
			"umzlmpkt",
			"gbwrcvne",
			"ojxhgpjx",
			"guilsoqn",
			"gmhevvyu",
			"yxbiapsk",
			"xavkgckn",
			"oljrydeo",
			"rassikom",
			"kjotmlyb",
			"dwxyakdn",
			"fmttxkgp",
			"tqxtydfw",
			"jegwpptl",
			"dheiyrrw",
			"fnaiqjwq",
			"ldaphdoe",
			"iehjjqwj",
			"akdsmjcx",
			"cpuwfxgd",
			"dhmcqcte",
			"kwuuunfw",
			"pyiounlv",
			"dngwbusj",
			"tknhdxaj",
			"hwmemiur",
			"ytunujra",
			"qpnvggkv",
			"vwyvpkdr",
			"bzuuhfvf",
			"pelkditd",
			"izfpyjxo",
			"vichipqf",
			"msxufsxn",
			"plarwsnc",
			"elcctlff",
			"trwutxzh",
			"nqzlugfe",
			"ibhooswf",
			"vilyadzz",
			"mdwcjrlg",
			"fakpkenj",
			"vyclxeqn",
			"jollpohs",
			"zycoopmh",
			"cchqzhfg",
			"douurmqb",
			"lmtjzvtv",
			"ozgmidde",
			"rituindj",
			"qewqlwpn",
			"vggprvnm",
			"layzliuj",
			"cplarsna",
			"pswyqxbr",
			"urgybdhb",
			"gmddljxz",
			"mqmhybdz",
			"qpcawnrk"
	};
}

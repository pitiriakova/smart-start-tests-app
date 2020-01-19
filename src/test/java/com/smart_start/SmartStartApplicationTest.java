package com.smart_start;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.function.Consumer;

/**
 * chris on 3/11/18:8:59 PM.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SmartStartApplicationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void indexPage() {
        webTestClient.get().uri("/test/aydzrrlv")
                .exchange()
                .expectStatus().isOk()
                .expectBody().consumeWith(responsePageContains("<div class=\"main-page\">"));
    }

    @Test
    public void indexPageWithWrongLessonId() {
        webTestClient.get().uri("/test/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody().consumeWith(responsePageContains("<h1>Page not found</h1>"));
    }

    private static Consumer<EntityExchangeResult<byte[]>> responsePageContains(String text) {
        return entityExchangeResult -> {
            try {
                Assert.assertTrue(new String(entityExchangeResult.getResponseBody(), StandardCharsets.UTF_8.name()).contains(text));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        };
    }

}

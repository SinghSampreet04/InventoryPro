package com.sam.inventory.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sam.inventory.backend.repository.ProductRepository;
import com.sam.inventory.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:inventory;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.jwt.secret=inventory-pro-test-secret-that-is-long-enough"
})
@AutoConfigureMockMvc
class InventoryApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        productRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void protectsInventoryEndpoints() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void supportsAuthenticatedInventoryWorkflow() throws Exception {
        String authBody = """
                {"username":"portfolio-user","password":"secure-pass"}
                """;

        String response = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("portfolio-user"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode auth = objectMapper.readTree(response);
        String bearerToken = "Bearer " + auth.get("token").asText();

        String productBody = """
                {
                  "name":"Mechanical Keyboard",
                  "sku":"key-001",
                  "quantity":4,
                  "price":129.99,
                  "category":"Accessories"
                }
                """;

        mockMvc.perform(post("/api/products")
                        .header("Authorization", bearerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("KEY-001"));

        mockMvc.perform(get("/analytics")
                        .header("Authorization", bearerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProducts").value(1))
                .andExpect(jsonPath("$.totalQuantity").value(4))
                .andExpect(jsonPath("$.lowStockProducts").value(1))
                .andExpect(jsonPath("$.totalInventoryValue").value(519.96));

        mockMvc.perform(get("/api/products/low-stock")
                        .header("Authorization", bearerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Mechanical Keyboard"));

        Long productId = productRepository.findAll().get(0).getId();
        mockMvc.perform(delete("/api/products/{id}", productId)
                        .header("Authorization", bearerToken))
                .andExpect(status().isNoContent());
    }
}

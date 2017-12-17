package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Categories;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Categories entity.
 */
public interface CategoriesSearchRepository extends ElasticsearchRepository<Categories, Long> {
}

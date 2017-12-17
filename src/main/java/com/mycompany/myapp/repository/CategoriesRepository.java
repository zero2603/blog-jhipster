package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Categories;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;


/**
 * Spring Data JPA repository for the Categories entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    List<Categories> findAllByOrderById();
}

package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Post;

import com.mycompany.myapp.repository.PostRepository;
import com.mycompany.myapp.repository.search.PostSearchRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import com.mycompany.myapp.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Post.
 */
@RestController
@RequestMapping("/api")
public class PostResource {

    private final Logger log = LoggerFactory.getLogger(PostResource.class);

    private static final String ENTITY_NAME = "post";

    private final PostRepository postRepository;

    private final PostSearchRepository postSearchRepository;

    public PostResource(PostRepository postRepository, PostSearchRepository postSearchRepository) {
        this.postRepository = postRepository;
        this.postSearchRepository = postSearchRepository;
    }

    /**
     * POST  /posts : Create a new post.
     *
     * @param post the post to create
     * @return the ResponseEntity with status 201 (Created) and with body the new post, or with status 400 (Bad Request) if the post has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/posts")
    @Timed
    public ResponseEntity<Post> createPost(@Valid @RequestBody Post post) throws URISyntaxException {
        log.debug("REST request to save Post : {}", post);
        if (post.getId() != null) {
            throw new BadRequestAlertException("A new post cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Post result = postRepository.save(post);
        postSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /posts : Updates an existing post.
     *
     * @param post the post to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated post,
     * or with status 400 (Bad Request) if the post is not valid,
     * or with status 500 (Internal Server Error) if the post couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/posts")
    @Timed
    public ResponseEntity<Post> updatePost(@Valid @RequestBody Post post) throws URISyntaxException {
        log.debug("REST request to update Post : {}", post);
        if (post.getId() == null) {
            return createPost(post);
        }
        Post result = postRepository.save(post);
        postSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, post.getId().toString()))
            .body(result);
    }

    /**
     * GET  /posts : get all the posts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of posts in body
     */
    @GetMapping("/posts")
    @Timed
    public ResponseEntity<List<Post>> getAllPosts(Pageable pageable) {
        log.debug("REST request to get a page of Posts");
        Page<Post> page = postRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/posts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /posts/:id : get the "id" post.
     *
     * @param id the id of the post to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the post, or with status 404 (Not Found)
     */
    @GetMapping("/posts/{id}")
    @Timed
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        log.debug("REST request to get Post : {}", id);
        Post post = postRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(post));
    }

    /**
     * DELETE  /posts/:id : delete the "id" post.
     *
     * @param id the id of the post to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/posts/{id}")
    @Timed
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        log.debug("REST request to delete Post : {}", id);
        postRepository.delete(id);
        postSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/posts?query=:query : search for the post corresponding
     * to the query.
     *
     * @param query the query of the post search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/posts")
    @Timed
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Posts for query {}", query);
        Page<Post> page = postSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/posts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /posts/orderbydate : get the all post order by date.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the post, 
     * or with status 404 (Not Found)
     */
    @GetMapping("/posts/orderbydate")
    @Timed
    public List<Post> getAllPostByDate() {
        return postRepository.findAllByOrderByDateDesc();
    }

    /**
     * GET  /posts/categories/:id : get the all post in categories.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the post, 
     * or with status 404 (Not Found)
     */
    @GetMapping("/posts/categories/{id}")
    @Timed
    public List<Post> getAllPostBycategories(@PathVariable Long id) {
        return postRepository.findAllByCategoriesId(id);
    }

}

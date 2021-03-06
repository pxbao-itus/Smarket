package api.java.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.java.entities.ProductType;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Integer> {

}
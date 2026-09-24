package backend.Repository;

import backend.Model.InventoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository <InventoryModel, Long> {
}

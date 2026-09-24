package backend.Controller;

import backend.Exception.InventoryNotFoundException;
import backend.Model.InventoryModel;
import backend.Repository.InventoryRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {
    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @PostMapping("/inventory")
    public InventoryModel newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
        return inventoryRepository.save(newInventoryModel);
    }

    @PostMapping("/inventory/itemImg")
    public String itemImage(@RequestParam("file") MultipartFile file) {
        String folder = "src/main/Upload/";
        String itemImage = file.getOriginalFilename();

        if (itemImage == null || itemImage.isBlank()) {
            return "error: invalid file name";
        }

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                throw new IOException("Failed to create upload directory: " + folder);
            }
            file.transferTo(Paths.get(folder, itemImage));
        } catch (IOException e) {
            e.printStackTrace();
            return "error: " + itemImage;
        }
        return itemImage;
    }

    //display
    @GetMapping("/inventory")
    List<InventoryModel> getAllItems() {
        return inventoryRepository.findAll();
    }
    @GetMapping("/inventory/{id}")
    InventoryModel getItemById(@PathVariable Long id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new InventoryNotFoundException(id));
    }

    @DeleteMapping("/inventory/{id}")
    String deleteItem(@PathVariable Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new InventoryNotFoundException(id);
        }
        inventoryRepository.deleteById(id);
        return "Item with id " + id + " has been deleted successfully.";
    }

    @PutMapping("/inventory/{id}")
    InventoryModel updateItem(@RequestBody InventoryModel newItem, @PathVariable Long id) {
        return inventoryRepository.findById(id)
            .map(item -> {
                item.setItemName(newItem.getItemName());
                item.setItemCategory(newItem.getItemCategory());
                item.setItemDetails(newItem.getItemDetails());
                if (newItem.getItemImage() != null && !newItem.getItemImage().isEmpty()) {
                    item.setItemImage(newItem.getItemImage());
                }
                return inventoryRepository.save(item);
            }).orElseThrow(() -> new InventoryNotFoundException(id));
    }

    private final String UPLOAD_DIR = "src/main/Upload/";

    @GetMapping("/upload/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            file = new File("src/main/upload/" + filename);
        }
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(new FileSystemResource(file));
    }
}

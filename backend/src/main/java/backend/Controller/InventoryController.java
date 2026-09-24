package backend.Controller;

import backend.Model.InventoryModel;
import backend.Repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

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
    
}

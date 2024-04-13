import { Router } from "express";
import multer from 'multer';
import { getamigurumis, createamigurumis, updateamigurumis, deleteamigurumis, getamigurumisById } from "../controllers/amigurumis.controllers.js";

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage });

// Rutas
router.get("/amigurumis", getamigurumis);
router.get("/amigurumis/:id", getamigurumisById);
router.post("/amigurumis", upload.single("image"), createamigurumis);
router.put("/amigurumis/:id", updateamigurumis);
router.delete("/amigurumis/:id", deleteamigurumis);

export default router;

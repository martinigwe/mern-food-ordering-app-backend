import express from "express";
import multer from "multer";
import MyRestuarantController from "../controllers/MyRestuarantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestauranRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});
router.get("/", jwtCheck, jwtParse, MyRestuarantController.getMyRestaurant)
router.post("/", upload.single("imageFile"), validateMyRestauranRequest, jwtCheck, jwtParse, MyRestuarantController.createMyRestuarant)
router.put("/", upload.single("imageFile"), validateMyRestauranRequest, jwtCheck, jwtParse, MyRestuarantController.updateMyRestaurant)

export default router;
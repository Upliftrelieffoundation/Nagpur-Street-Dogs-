import express from "express";
import multer from "multer";
import {
  uploadDogImages,
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  adoptDog,
  deleteDog,
  getUserDogs,
  getTrendingDogs,
  getDogsByBreed,
  getDogsByLocation
} from "../Components/DogController.js";

const dogRouter = express.Router();

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload dog images route
dogRouter.post("/upload-dog-images", upload.array("images", 5), uploadDogImages);

// GET all dogs with filters and pagination
dogRouter.get('/dogs', getAllDogs);

// GET single dog details
dogRouter.get('/getdogs/:id', getDogById);

// POST new dog for adoption (requires authentication)
dogRouter.post('/createdog', createDog);

// PUT update dog details (only owner can update)
dogRouter.put('/dogs/:id', updateDog);

// PUT mark dog as adopted
dogRouter.put('/dogs/:id/adopt', adoptDog);

// DELETE dog listing (only owner can delete)
dogRouter.delete('/dogs/:id', deleteDog);

// GET user's posted dogs
dogRouter.get('/user/dogs', getUserDogs);

// GET trending/featured dogs
dogRouter.get('/trending', getTrendingDogs);

// POST get dogs by specific breed
dogRouter.post('/breed', getDogsByBreed);

// POST get dogs by location
dogRouter.post('/location', getDogsByLocation);

export default dogRouter;
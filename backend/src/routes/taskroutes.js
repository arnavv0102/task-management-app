const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authmiddleware");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require("../controllers/taskcontroller");

// All routes protected
router.use(authenticate);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/stats", getTaskStats);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;

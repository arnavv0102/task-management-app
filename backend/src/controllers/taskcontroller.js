const supabase = require("../config/supabase");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, status, duedate } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{
        title,
        description,
        category,
        priority,
        status,
        duedate,
        userid: userId
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL TASKS FOR USER
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("userid", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE TASK
exports.getTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("userid", userId)
      .single();

    if (error) return res.status(404).json({ message: "Task not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .eq("userid", userId)
      .select()
      .single();

    if (error) return res.status(404).json({ message: "Task not found or update failed" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("userid", userId)
      .select()
      .single();

    if (error) return res.status(404).json({ message: "Task not found or delete failed" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TASK STATS
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("tasks")
      .select("status, count:id", { count: "exact", head: false })
      .eq("userid", userId)
      .group("status");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

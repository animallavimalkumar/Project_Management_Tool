import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./project.css";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    status: "Active",
    completionDate: "",
  });
  const [editProject, setEditProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch projects on initial load
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle input change for creating/editing project
  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Save or Update Project
  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.category || !newProject.status) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const url = editProject
        ? `http://localhost:5000/api/projects/${editProject._id}`
        : "http://localhost:5000/api/projects";
      const method = editProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      const updatedProject = await response.json();
      if (!response.ok) throw new Error("Error saving project: " + updatedProject.message);

      // Update projects list after adding/updating
      setProjects((prevProjects) =>
        editProject
          ? prevProjects.map((project) => (project._id === updatedProject._id ? updatedProject : project))
          : [...prevProjects, updatedProject]
      );

      setNewProject({ title: "", description: "", category: "", status: "Active", completionDate: "" });
      setEditProject(null);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a project
  const handleEditProject = (project) => {
    setEditProject(project);
    setNewProject({ ...project });
  };

  // Handle deleting a project
  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (confirmDelete) {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error deleting project");

        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
        alert("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">Projects</h1>
      <button className="btn btn-info mb-3" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="card p-3 mb-4 shadow">
        <h5>{editProject ? "Edit Project" : "Add New Project"}</h5>
        <input
          type="text"
          className="form-control mb-2"
          name="title"
          placeholder="Title"
          value={newProject.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="form-control mb-2"
          name="description"
          placeholder="Description"
          value={newProject.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="form-control mb-2"
          name="category"
          placeholder="Category"
          value={newProject.category}
          onChange={handleInputChange}
        />
        <select
          name="status"
          className="form-control mb-2"
          value={newProject.status}
          onChange={handleInputChange}
        >
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
        {newProject.status === "Completed" && (
          <input
            type="date"
            className="form-control mb-2"
            name="completionDate"
            value={newProject.completionDate}
            onChange={handleInputChange}
          />
        )}
        <button
          className={`btn ${editProject ? "btn-warning" : "btn-success"} me-2`}
          onClick={handleSaveProject}
          disabled={loading}
        >
          {loading ? "Saving..." : editProject ? "Save Changes" : "Add Project"}
        </button>
      </div>
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text"><strong>Description:</strong> {project.description}</p>
                <p className="card-text"><strong>Category:</strong> {project.category}</p>
                <p className="card-text"><strong>Status:</strong> {project.status}</p>
                {project.status === "Completed" && project.completionDate && (
                  <p className="card-text"><strong>Completion Date:</strong> {project.completionDate}</p>
                )}
                <button className="btn btn-warning me-2" onClick={() => handleEditProject(project)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteProject(project._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;

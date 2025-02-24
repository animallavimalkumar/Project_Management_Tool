import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "E-Commerce Website", category: "Web Development" },
    { id: 2, name: "Chatbot AI", category: "AI/ML" },
    { id: 3, name: "Mobile Banking App", category: "Mobile Development" },
    { id: 4, name: "Sales Data Analysis", category: "Data Science" },
  ]);

  const [search, setSearch] = useState("");
  const [newProject, setNewProject] = useState({ name: "", category: "" });
  const [editProject, setEditProject] = useState(null);

  // Filter projects based on search input
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Add a new project
  const handleAddProject = () => {
    if (newProject.name && newProject.category) {
      setProjects([...projects, { id: projects.length + 1, ...newProject }]);
      setNewProject({ name: "", category: "" });
    }
  };

  // Delete a project
  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  // Start editing a project
  const handleEditProject = (project) => {
    setEditProject(project);
    setNewProject({ name: project.name, category: project.category });
  };

  // Save edited project
  const handleSaveEdit = () => {
    setProjects(
      projects.map((project) =>
        project.id === editProject.id ? { ...project, ...newProject } : project
      )
    );
    setEditProject(null);
    setNewProject({ name: "", category: "" });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">Projects</h1>

      {/* Navigation Links */}
      <div className="d-flex justify-content-center mb-4">
        <Link to="/" className="btn btn-primary me-2">Home</Link>
        <Link to="/dashboard" className="btn btn-success">Dashboard</Link>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add/Edit Project Form */}
      <div className="card p-3 mb-4 shadow">
        <h5>{editProject ? "Edit Project" : "Add New Project"}</h5>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Project Name"
            value={newProject.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            name="category"
            placeholder="Project Category"
            value={newProject.category}
            onChange={handleInputChange}
          />
        </div>
        {editProject ? (
          <button className="btn btn-warning me-2" onClick={handleSaveEdit}>Save</button>
        ) : (
          <button className="btn btn-success" onClick={handleAddProject}>Add</button>
        )}
        {editProject && (
          <button className="btn btn-secondary ms-2" onClick={() => setEditProject(null)}>Cancel</button>
        )}
      </div>

      {/* Project List */}
      <div className="row">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="col-md-6 mb-4">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text"><strong>Category:</strong> {project.category}</p>
                  <button className="btn btn-warning me-2" onClick={() => handleEditProject(project)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
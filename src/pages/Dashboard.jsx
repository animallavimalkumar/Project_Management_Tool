import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const projectData = [
  { category: "Web Development", projects: 10 },
  { category: "Mobile Development", projects: 7 },
  { category: "AI/ML", projects: 5 },
  { category: "Data Science", projects: 8 },
];

const timelineData = [
  { month: "Jan", completed: 2 },
  { month: "Feb", completed: 3 },
  { month: "Mar", completed: 1 },
  { month: "Apr", completed: 5 },
  { month: "May", completed: 4 },
];

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">Project Dashboard</h1>

      {/* Navigation Links */}
      <div className="d-flex justify-content-center mb-4">
        <Link to="/" className="btn btn-primary me-2">Home</Link>
        <Link to="/projects" className="btn btn-success">Projects</Link>
      </div>

      {/* Summary Stats */}
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>Total Projects</h4>
            <h2 className="text-primary">{projectData.reduce((acc, item) => acc + item.projects, 0)}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>Active Projects</h4>
            <h2 className="text-success">{Math.floor(Math.random() * 10) + 5}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3">
            <h4>Completed Projects</h4>
            <h2 className="text-danger">{timelineData.reduce((acc, item) => acc + item.completed, 0)}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        {/* Bar Chart */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h5 className="text-center">Projects by Category</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h5 className="text-center">Project Completion Timeline</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#28a745" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
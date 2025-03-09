import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2"; // Import Bar Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Import BarElement for Bar Chart
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Register BarElement for Bar Chart
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Start as loading

  // Fetch projects and update the completed count
  const fetchProjects = async () => {
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
      setProjects(data); // Update state with fetched projects
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Fetch projects when component mounts
  }, []);

  // Helper function to count projects for each status in a given month
  const countProjectsByStatusAndMonth = (status, monthIndex) => {
    return projects.filter((project) => {
      const projectDate = new Date(project.createdAt); // Assuming createdAt field exists
      const projectMonth = projectDate.getMonth(); // Get the month of the project creation date
      return projectMonth === monthIndex && project.status === status;
    }).length;
  };

  // Prepare the data for the Completed Projects Line Chart (based on status)
  const completedProjectsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("Completed", index);
        }),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      {
        label: "In Progress Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("In Progress", index);
        }),
        fill: false,
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.1,
      },
      {
        label: "On Hold Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("On Hold", index);
        }),
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  // Prepare the data for the Total Projects Bar Chart (grouped by status)
  const totalProjectsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("Completed", index);
        }),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "In Progress Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("In Progress", index);
        }),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "On Hold Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          return countProjectsByStatusAndMonth("On Hold", index);
        }),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare the data for the Project Category Bar Chart
  const projectCategoryData = () => {
    // Assuming that each project has a "category" property
    const categories = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categories), // Categories
      datasets: [
        {
          label: "Projects by Category",
          data: Object.values(categories), // Counts for each category
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Projects Overview",
      },
    },
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">Dashboard</h1>

      {/* Navigation buttons */}
      <div className="mb-4">
        <Link to="/" className="btn btn-primary me-2">Home</Link>
        <Link to="/projects" className="btn btn-secondary">Projects</Link>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <h3>Total Completed Projects: {projects.filter((project) => project.status === "Completed").length}</h3>

          {/* Flexbox for charts */}
          <div className="d-flex flex-wrap justify-content-around mb-4">
            {/* Completed Projects Line Chart */}
            <div className="card shadow m-2" style={{ flex: "1 1 30%" }}>
              <div className="card-body">
                <h5 className="card-title">Completed Projects Timeline</h5>
                <Line data={completedProjectsData} options={options} />
              </div>
            </div>

            {/* Total Projects Bar Chart */}
            <div className="card shadow m-2" style={{ flex: "1 1 30%" }}>
              <div className="card-body">
                <h5 className="card-title">Total Projects by Month</h5>
                <Bar data={totalProjectsData} options={options} />
              </div>
            </div>

            {/* Project Category Bar Chart */}
            <div className="card shadow m-2" style={{ flex: "1 1 80%" }}>
              <div className="card-body">
                <h5 className="card-title">Projects by Category</h5>
                <Bar data={projectCategoryData()} options={options} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

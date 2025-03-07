import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";  // Import Bar Chart
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
  const [loading, setLoading] = useState(false);

  // Fetch projects and update the completed count
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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Prepare the data for the Completed Projects Line Chart
  const completedProjectsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          const completedProjectsInMonth = projects.filter((project) => {
            if (project.status === "Completed" && project.completionDate) {
              const completionDate = new Date(project.completionDate);
              const projectMonth = completionDate.getMonth();
              return projectMonth === index;
            }
            return false;
          });
          return completedProjectsInMonth.length;
        }),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  // Prepare the data for the Total Projects Bar Chart
  const totalProjectsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Projects",
        data: Array.from({ length: 12 }, (_, index) => {
          const totalProjectsInMonth = projects.filter((project) => {
            const creationDate = new Date(project.createdAt); // Assuming createdAt field exists
            const projectMonth = creationDate.getMonth(); // Get the month of the project creation date
            return projectMonth === index;
          });
          return totalProjectsInMonth.length; // Count the number of projects for the given month
        }),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
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
        <div>Loading...</div>
      ) : (
        <div>
          <h3>Total Completed Projects: {projects.filter((project) => project.status === "Completed").length}</h3>
          
          {/* Completed Projects Line Chart */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">Completed Projects Timeline</h5>
                  <Line data={completedProjectsData} options={options} />
                </div>
              </div>
            </div>
          </div>

          {/* Total Projects Bar Chart */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">Total Projects by Month</h5>
                  <Bar data={totalProjectsData} options={options} />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React from "react";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css"; // Import Animate.css for animations

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin"); // Redirects to Sign In after logout
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            Project Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/signin" className="text-light mx-2">Sign In</Nav.Link>
              <Nav.Link as={Link} to="/signup" className="text-light mx-2">Sign Up</Nav.Link>
              <Nav.Link as={Link} to="/dashboard" className="text-light mx-2">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/projects" className="text-light mx-2">Projects</Nav.Link>
              <Button variant="danger" onClick={handleLogout} className="ms-3 px-3 fw-semibold">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-5 shadow-lg text-center w-75 w-md-50 bg-light rounded-4 animate__animated animate__fadeIn">
          <Card.Body>
            <h1 className="mb-4 text-primary fw-bold animate__animated animate__fadeInDown">
              Welcome to Project Management Tool
            </h1>
            <p className="lead text-muted fst-italic animate__animated animate__fadeInUp">
              An all-in-one platform to <strong>plan, track, and manage</strong> your projects efficiently.
            </p>
            <hr className="animate__animated animate__fadeInLeft" />
            
            {/* Features Section */}
            <div className="text-start animate__animated animate__fadeInUp">
              <p className="text-muted">
                <span className="text-success fw-bold">✔ Organize Projects:</span> Create, categorize, and manage projects effortlessly.
              </p>
              <p className="text-muted">
                <span className="text-success fw-bold">✔ Track Progress:</span> Monitor milestones, deadlines, and completion rates.
              </p>
              <p className="text-muted">
                <span className="text-success fw-bold">✔ Collaborate Seamlessly:</span> Assign tasks, share updates, and work in real-time.
              </p>
              <p className="text-muted">
                <span className="text-success fw-bold">✔ Data Insights:</span> Gain valuable analytics with interactive charts.
              </p>
              <p className="text-muted">
                <span className="text-success fw-bold">✔ Boost Productivity:</span> Automate workflows and prioritize work efficiently.
              </p>
            </div>

            <p className="text-muted animate__animated animate__fadeInRight fw-semibold">
              Whether you're handling small tasks or large-scale projects, our tool helps you 
              <span className="text-primary"> stay on top of everything effortlessly.</span>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Home;
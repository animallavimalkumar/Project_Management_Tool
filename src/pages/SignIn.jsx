import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem("token", data.user.token);
                localStorage.setItem("role", role);
                alert("Login Successful!");
                navigate("/home");
            } else {
                alert("Login Failed: " + data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    // Mock social login functions
    const handleGoogleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    };

    const handleGitHubLogin = () => {
        window.open("http://localhost:5000/auth/github", "_self");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Sign In</h2>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Role</label>
                    <select
                        className="form-select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>

                <button className="btn btn-primary w-100 mb-2" onClick={handleSignIn}>
                    Sign In
                </button>

                <div className="text-center mt-3">
                    <button className="btn btn-outline-danger w-100 mb-2" onClick={handleGoogleLogin}>
                        Sign in with Google
                    </button>
                    <button className="btn btn-outline-dark w-100" onClick={handleGitHubLogin}>
                        Sign in with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
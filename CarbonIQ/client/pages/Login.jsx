import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "../services/authService";
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup;

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!response.token) {
        throw new Error("Login failed: No token received.");
      }

      // Store token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faffff] flex items-start justify-center">
      <div className="bg-white border p-20 border-[#d3d5d9] shadow rounded-[36px]">
        <div className="flex items-center space-x-[8px] text-[#6b7280] font-jost font-medium text-[18px] leading-[26px]">
          <ArrowLeft className="text-[#1d1b20]" />
          <Link to="/" className="text-[14px] font-jost hover:text-gray-900">
            Back to Main Page
          </Link>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="rounded-full w-44 h-44 my-7 bg-white border border-[#919191] shadow flex items-center justify-center overflow-hidden">
            <img src={logo} alt="CarbonIQ Logo" />
          </div>

          <h2 className="w-full text-[48px] my-3 font-jost font-bold text-black leading-[58px]">
            Welcome to CarbonIQ
          </h2>
          <p className="text-[20px] font-jost font-normal text-[#6b7280] my-3">
            Sign in to continue
          </p>

          {fromSignup && (
            <p className="text-green-600 text-sm font-jost">
              Account created successfully! Please log in.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col my-3 space-y-6">
            <div className="relative flex flex-col items-center w-full">
              <label className="mb-2 font-jost font-medium text-[14px] text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bg-[#fcfcfc] w-full p-1 pl-10 rounded-md border border-[#c4c4c4] text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Mail className="absolute left-[12px] top-[34px] text-[#c2c2c2]" size={20} />
            </div>

            <div className="relative flex flex-col items-center w-full">
              <label className="mb-2 font-jost font-medium text-[14px] text-black">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="bg-[#fcfcfc] border w-full p-1 pl-10 border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Lock className="text-[#c2c2c2] absolute left-[12px] top-[34px]" size={20} />
              <EyeOff className="text-[#b6b6b6] absolute left-[320px] top-[34px]" size={20} />
            </div>

            {error && <p className="text-red-500 text-sm font-jost text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-black border w-95 p-3 mt-5 border-[#c4c4c4] rounded-md text-white font-jost font-bold text-[16px] hover:bg-gray-900 transition duration-200"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="flex justify-between text-[14px] mt-2">
              <div>
                <span className="text-[#a8a8a8] mr-1 mt-100">Need an account?</span>
                <Link to="/signup" className="text-[#4e4e4e] font-semibold">Sign up</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

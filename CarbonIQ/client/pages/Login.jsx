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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard");
    }, [navigate]);

    const location = useLocation();
    const fromSignup = location.state?.fromSignup;
    
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const response = await login({ email: formData.email, password: formData.password });

            console.log("Login success:", response);
            alert("Login successful!");

            // Stores token and user info
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
            }

            navigate("/dashboard"); //Redirect to the proctected route after logging in
        } catch (err) {
            console.error("Login error:", err.message);
            setError(err.message || "Invalid email or password. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-[1440px] h-[1049px] bg-[#faffff] flex items-start justify-center">
            {/* Login Card */}
            <div className="absolute top-[18px] left-[370px] w-[711px] h-[991px] bg-white border border-[#d3d5d9] shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)] rounded-[36px]">
                {/* Back to Main Page */}
                <div className="absolute top-[52px] left-[418px] flex items-center space-x-2 text-[#6b7280] font-jost font-medium text-[18px]">
                    <ArrowLeft className="w-6 h-6" />
                    <Link to="/" className="text-[12px] font-medium font-jost hover:text-gray-900">
                        Back to Main Page
                    </Link>
                </div>

                {/* Logo */}
                <div className="absolute top-[120px] left-[630px] w-[180px] h-[180px] rounded-full bg-white border border-[#919191] shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)]">
                    <img src={logo} alt="CarbonIQ Logo" />
                </div>

                {/* Title */}
                <h2 className="absolute top-[348px] left-[460px] text-[48px] font-jost font-bold text-black leading-[58px]">
                    Welcome to CarbonIQ
                </h2>
                <p className="absolute top-[416px] left-[640px] text-[20px] font-jost font-normal text-[#6b7280] leading-[29px]">
                    Sign in to continue
                </p>

                {/* Redirects from signup */}
                {fromSignup && (
                    <p className="absolute top-[450px] left-[640px] text-green-600 text-sm font-jost">
                        Account created successfully! Please log in.
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="absolute top-[503px] left-[522px] w-[396px] flex flex-col space-y-6 ">
                     {/* Email Field */}
                    <div className="relative">
                        <label className="absolute top-[-24px] left-0 font-jost font-medium text-[14px] text-black">
                            Email
                        </label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full h-[44px] pl-[28px] pr-3 bg-[#fcfcfc] border border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
                        />
                         <Mail className="absolute left-[16px] top-[12px] text-[#c2c2c2]" size={20} />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label className="absolute top-[-24px] left-0 font-jost font-medium text-[14px] text-black">
                            Password
                        </label>    
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full h-11 pl-10 pr-10 bg-[#fcfcfc] border border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <Lock className="absolute left-[16px] top-[12px] text-[#c2c2c2]" size={20} />
                        <EyeOff className="absolute right-[16px] top-[12px] text-[#b6b6b6]" size={20} />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm font-jost text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[40px] bg-black border border-[#c4c4c4] rounded-[6px] text-white font-jost font-bold text-[16px] hover:bg-gray-900 transition duration-200"
                    >
                        {loading ? "Logging in...": "Log In"}
                    </button>

                    {/* Forget password / Need account links */}
                    <div className="flex justify-between text-[14px] mt-2">
                        <Link to="/forgot-password" className="text-[#919191]">
                            Forgot password?
                        </Link>
                        <div>
                            <span className="text-[#a8a8a8] mr-2">Need an account?</span>
                            <Link to="/signup" className="text-[#4e4e4e]">Sign up</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, EyeOff, ArrowLeft } from "lucide-react";
import { signup } from "../services/authService";

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate])
    
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);
            const response = await signup({email: formData.email, password: formData.password });
            console.log("Signup success:", response);

            // Auto-login: save token and user if backend returns it
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                navigate("/dashboard");
            } else {
                // Otherwise, redirect to login
                alert("Account created successfully! Please log in.")
                navigate("/login", { state: { fromSignup: true } });
            }
        } catch (err) {
            console.error("Signup error:", err.message);
            setError(err.message || "Failed to create account. Try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen bg-[#faffff] flex items-center justify-center">
            {/* Signup Card */}
            <div className="relative bg-white border border-[#d3d5d9] rounded-[36px] shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)] w-[600px] h-[600px] flex flex-col items-center px-10">
                {/* Back to Login */}
                <div className="absolute top-[26px] left-[60px] flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                    <Link to="/login" className="text-[18px] font-medium font-jost">
                        Back to Log-In
                    </Link>
                </div>

                {/* Title */}
                <h2 className="font-jost font-bold text-[32px] text-black mt-[90px] mb-8">
                    Create your account
                </h2>

                {/* Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className="w-full max-w-[396px] flex flex-col space-y-6"
                >
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1 font-jost">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-[#c2c2c2]" size={20} />
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full h-11 pl-10 pr-3 bg-[#fcfcfc] border border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1 font-jost">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-[#c2c2c2]" size={20} />
                            <input 
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 8 characters"
                                required
                                className="w-full h-11 pl-10 pr-10 bg-[#fcfcfc] border border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <EyeOff className="absolute right-3 top-3 text-[#b6b6b6]" size={20} />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1 font-jost">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-[#c2c2c2]" size={20} />
                            <input 
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                required
                                className="w-full h-11 pl-10 pr-10 bg-[#fcfcfc] border border-[#c4c4c4] rounded-md text-sm text-gray-700 placeholder-[#b6b6b6] font-jost focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <EyeOff className="absolute right-3 top-3 text-[#b6b6b6]" size={20} />
                        </div>
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
                        className="w-full h-12 bg-black border border-[#c4c4c4] rounded-md text-white font-jost font-bold text-[16px] hover:bg-gray-900 transition duration-200"
                    >
                        {loading ? "Creating...": "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default Signup;

import { useContext, useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const AdminLogin = () => {
  const {
    navigate,
    loading,
    setLoading,
    axios,
    setAdmin,
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter admin email");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter admin password");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/auth/admin/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("Admin login response:", data);

      if (data.success) {
        // Save admin login state
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin || true)
        );

        setAdmin(data.admin || true);

        toast.success(data.message || "Admin login successful");

        navigate("/admin");
      } else {
        toast.error(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to login as admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl px-8 py-10"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access the admin dashboard
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Admin Email
          </label>

          <div className="flex items-center w-full h-13 border border-gray-300 rounded-2xl px-4 gap-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
            <MailIcon
              size={20}
              className="text-gray-500 flex-shrink-0"
            />

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={onChangeHandler}
              className="w-full h-full outline-none text-gray-800 bg-transparent"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Admin Password
          </label>

          <div className="flex items-center w-full h-13 border border-gray-300 rounded-2xl px-4 gap-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
            <LockIcon
              size={20}
              className="text-gray-500 flex-shrink-0"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={onChangeHandler}
              className="w-full h-full outline-none text-gray-800 bg-transparent"
              required
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Admin access only
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/api/auth/forgot-password", { email }, { withCredentials: true });
      if (res.data.success) {
        setSent(true);
        toast({ title: "Email sent", description: "Check your inbox for reset instructions." });
      }
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Something went wrong", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
      <p className="text-gray-500 mb-6">Enter your email to receive a password reset link.</p>
      {sent ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">Reset link sent! Check your email.</p>
          <Link to="/auth/login" className="text-sm underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full border rounded-md px-3 py-2" />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <Link to="/auth/login" className="block text-center text-sm underline">Back to login</Link>
        </form>
      )}
    </div>
  );
}

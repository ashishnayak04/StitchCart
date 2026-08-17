import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:9000/api/auth/reset-password", { token, newPassword: password }, { withCredentials: true });
      if (res.data.success) {
        setDone(true);
        toast({ title: "Success", description: "Password reset successfully." });
      }
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Invalid or expired token", variant: "destructive" });
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4 text-center">
        <p className="text-red-600 mb-4">Invalid reset link.</p>
        <Link to="/auth/forgot-password" className="text-sm underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
      <p className="text-gray-500 mb-6">Enter your new password below.</p>
      {done ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">Password reset successfully!</p>
          <Link to="/auth/login" className="text-sm underline">Go to login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required minLength={6} className="w-full border rounded-md px-3 py-2" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required minLength={6} className="w-full border rounded-md px-3 py-2" />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

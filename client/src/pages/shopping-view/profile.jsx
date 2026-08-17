import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, Camera } from "lucide-react";
import axios from "axios";

export default function ShoppingProfile() {
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ userName: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setForm({ userName: user.userName || "", phone: user.phone || "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.put("http://localhost:9000/api/auth/update-profile", { userId: user.id, ...form }, { withCredentials: true });
      if (res.data.success) {
        toast({ title: "Profile updated" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
    }
    setSending(false);
  };

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:9000/api/auth/send-verification/${user.id}`, {}, { withCredentials: true });
      toast({ title: "Verification email sent" });
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {form.avatar ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
          </div>
          <div>
            <p className="font-medium">{user?.userName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs mt-1">
              {user?.isEmailVerified ? <span className="text-green-600">Email verified</span> : (
                <button onClick={handleSendVerification} disabled={loading} className="text-blue-600 hover:underline">
                  {loading ? "Sending..." : "Verify email"}
                </button>
              )}
            </p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <div className="flex items-center border rounded-md px-3">
              <User className="w-4 h-4 text-gray-400" />
              <input value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} className="w-full px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Phone</label>
            <div className="flex items-center border rounded-md px-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" className="w-full px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Avatar URL</label>
            <div className="flex items-center border rounded-md px-3">
              <Camera className="w-4 h-4 text-gray-400" />
              <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <button type="submit" disabled={sending} className="bg-black text-white px-6 py-2 rounded-md text-sm disabled:opacity-50">
            {sending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

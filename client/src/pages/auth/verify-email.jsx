import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    axios.post("http://localhost:9000/api/auth/verify-email", { token }, { withCredentials: true })
      .then((res) => { if (res.data.success) setStatus("success"); else setStatus("error"); })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="w-full max-w-md mx-auto py-16 px-4 text-center">
      {status === "verifying" && <p className="text-gray-500">Verifying your email...</p>}
      {status === "success" && (
        <div>
          <p className="text-green-600 text-lg font-semibold mb-4">Email verified successfully!</p>
          <Link to="/auth/login" className="text-sm underline">Go to login</Link>
        </div>
      )}
      {status === "error" && (
        <div>
          <p className="text-red-600 text-lg font-semibold mb-4">Verification failed or link expired.</p>
          <Link to="/auth/login" className="text-sm underline">Go to login</Link>
        </div>
      )}
    </div>
  );
}

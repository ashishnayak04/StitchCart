import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        navigate("/auth/login");
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-luxury-charcoal">
          Create Account
        </h1>
        <p className="mt-3 text-sm text-luxury-taupe">
          Join us and discover timeless elegance
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText="Create Account"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="text-center text-sm text-luxury-taupe">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;

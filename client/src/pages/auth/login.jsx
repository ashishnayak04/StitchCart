import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="display-md text-foreground">Welcome Back</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to your account to continue
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-foreground hover:text-accent transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;

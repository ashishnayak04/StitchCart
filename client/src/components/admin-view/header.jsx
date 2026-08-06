import { Menu, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface-raised border-b border-border">
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex-1" />
      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-muted hover:text-foreground"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">Sign Out</span>
      </Button>
    </header>
  );
}

export default AdminHeader;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex justify-between items-center py-4 min-h-[80px]">
        <Link to="/" className="text-xl font-semibold">BeautySalon</Link>
        <ul className="flex items-center gap-6">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          {!user && <li><Link to="/login">Login</Link></li> }
          {user && <div className="btn" onClick={logout}>Logout</div> }
        </ul>
      </nav>
    </header>
  );
}
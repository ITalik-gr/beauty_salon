import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const { user, logout, loading } = useAuth();
  
  return (
    <header className="bg-white shadow">
      <nav className="cont mx-auto flex justify-between items-center py-4 min-h-[80px]">
        <Link to="/" className="text-xl font-semibold">BeautySalon</Link>
        <ul className="flex items-center gap-6">
          <li><Link to="/services">Послуги</Link></li>
          <li><Link to="/profile">Профіль</Link></li>
          {user && user.role === 'ADMIN' && <li><Link to="/panel">Адмін Панель</Link></li> }
          {!user && <li><Link to="/login">Увійти</Link></li> }
          {user && <div className="btn" onClick={logout}>Вийти</div> }
        </ul>
      </nav>
    </header>
  );
}
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="text-xl font-semibold">BeautySalon</Link>
        <ul className="flex gap-6">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/booking">Booking</Link></li>
        </ul>
      </nav>
    </header>
  );
}
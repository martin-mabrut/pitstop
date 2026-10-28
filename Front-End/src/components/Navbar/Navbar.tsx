import logo from "../../assets/logo + title SVG.svg";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar-pitstop">
      <img src={logo} alt="PitStop" className="navbar-pitstop__logo" />
    </nav>
  );
}

export default Navbar;

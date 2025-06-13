import { NavLink, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const topic = location.pathname.split("/")[2] || "archimedes";

  return (
    <div
      className="d-flex justify-content-center py-3"
      style={{
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Nav variant="pills" className="gap-4">

        {/* Activity Videos */}
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to={`/videos/${topic}`}
            className="text-white"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#ffe100", color: "black", borderRadius: "50px", fontWeight: "bold" } : {}
            }
          >
            Activity Videos
          </Nav.Link>
        </Nav.Item>

        {/* Activity Images */}
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to={`/images/${topic}`}
            className="text-white"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#ffe100", color: "black", borderRadius: "50px", fontWeight: "bold" } : {}
            }
          >
            Activity Images
          </Nav.Link>
        </Nav.Item>

      </Nav>
    </div>
  );
};

export default Navbar;

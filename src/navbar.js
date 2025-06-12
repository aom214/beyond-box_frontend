// Navbar.js
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import './Navbar.css'

const Navbar = () => {
  return (
    <div
      className="d-flex justify-content-center py-3"
      style={{
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Nav variant="pills" className="gap-4">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/videos"
            className="text-white"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#ffe100", color: "black", borderRadius: "50px", fontWeight: "bold" } : {}
            }
          >
            Activity Videos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/images"
            className="text-white"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#ffe100", color: "black", borderRadius: "50px", fontWeight: "bold" } : {}
            }
          >
            Activity Images
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/comments"
            className="text-white"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#ffe100", color: "black", borderRadius: "50px", fontWeight: "bold" } : {}
            }
          >
            Comments
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Navbar;

import { Link } from 'react-router-dom';
import '../styles/MainMenu.css'; // Import the CSS for styling

function MainMenu() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Calendar", path: "/calendar" },
    { name: "Goals", path: "/goals" },
    { name: "Notes", path: "/notes" },
    { name: "Settings", path: "/settings" }
  ];

  return (
    <div className="menu-container">
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <Link to={item.path}>{item.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainMenu;

import { Navbar, Container } from 'react-bootstrap';
import { Bricks } from 'react-bootstrap-icons';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          <Bricks color="beige" /> Sprint Planner
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;

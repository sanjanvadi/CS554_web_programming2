import Link from "next/link";
import logo from "../img/Ticketmaster.png"
import Image from "next/image";
const Header = () => (
  <div className="App">
    <header className="App-header">
      <Image src={logo} className="App-logo" alt="logo" height={500}
          width={500}/>
      <h1 className='App-title'>Welcome to Ticketmaster API</h1>
      <Link className="showlink" href="/">
        Home
      </Link>
      <Link className="showlink" href="/events/page/1">
        Events
      </Link>
      <Link className="showlink" href="/attractions/page/1">
        Attractions
      </Link>
      <Link className="showlink" href="/venues/page/1">
        Venues
      </Link>
    </header>
  </div>
);

export default Header;

import React from 'react';
import logo from './img/Ticketmaster.png';
import './App.css';
import Attractions from './components/Attractions';
import AttractionInfo from './components/AttractionInfo';
import Events from './components/Events';
import EventInfo from './components/EventInfo';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Venues from './components/Venues';
import VenueInfo from './components/VenueInfo';
import NotFound from './components/NotFound';

const App = () => {
	return (
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<h1 className='App-title'>Welcome to Ticketmaster API</h1>
					<Link className='showlink' to='/'>
						Home
					</Link>
					<Link className='showlink' to='/events/page/1'>
						Events
					</Link>
					<Link className='showlink' to='/attractions/page/1'>
						Attractions
					</Link>
					<Link className='showlink' to='/venues/page/1'>
						Venues
					</Link>
				</header>
				<br />
				<br />
				<div className='App-body'>
					<Switch>
						<Route exact path='/' component={Home} />
						<Route exact path='/events/page/:page' component={Events}/>
						<Route exact path='/events/:id' component={EventInfo}/>	
						<Route exact path='/attractions/page/:page' component={Attractions}/>
						<Route exact path='/attractions/:id' component={AttractionInfo}/>
						<Route exact path='/venues/page/:page' component={Venues}/>
						<Route exact path='/venues/:id' component={VenueInfo}/>
						<Route path='*' component={NotFound}/>
					</Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;

import React from 'react';
import '../App.css';

const Home = () => {
	return (
		<div>
			<p className='venueTitle'>
				Welcome to Ticketmaster API				
			</p>
			<p>
				Buy tickets for your favorite Events/Attractions/Venues.<br/>
				Use the above buttons to navigate to all Event/Attractions/Venues<br/>
				Click any Event/Attraction/Venue to view more details and to buy tickets.<br/>
				Search for your preferred Event/Attraction/Venue using the Search Bar 
			</p>
			<div>
				This application queries several Ticketmaster API's end-points<br/>
				<p>Attractions<br/>
				<a className='link' href='/attractions/page/1'>https://app.ticketmaster.com/discovery/v2/attractions?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</a>
				</p>
				<p>Events<br/>
				<a className='link' href='/events/page/1'>https://app.ticketmaster.com/discovery/v2/events?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</a>
				</p>
				<p>Venues<br/>
				<a className='link' href='/venues/page/1'>https://app.ticketmaster.com/discovery/v2/venues?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</a>
				</p>
				<br/><br/>		
			</div>
		</div>
	);
};

export default Home;

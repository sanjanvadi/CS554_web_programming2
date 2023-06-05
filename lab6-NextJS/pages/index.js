import Link from "next/link";
import Layout from "../components/MyLayout";

const Index = () => (
    <Layout>
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
				<Link className='link' href='/attractions/page/1'>https://app.ticketmaster.com/discovery/v2/attractions?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</Link>
				</p>
				<p>Events<br/>
				<Link className='link' href='/events/page/1'>https://app.ticketmaster.com/discovery/v2/events?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</Link>
				</p>
				<p>Venues<br/>
				<Link className='link' href='/venues/page/1'>https://app.ticketmaster.com/discovery/v2/venues?apikey=[API-KEY]&page=[PAGE_NUMBER]&countryCode=[code]&keyword=[searchTerm]</Link>
				</p>
				<br/><br/>		
			</div>
		</div>
    </Layout>
  );
  
  export default Index;
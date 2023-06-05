import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import NotFound from './NotFound';
import '../App.css';

const VenueInfo = (props) => {
	const [ data, setData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ error, setError] = useState(false);

	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
					const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/venues?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&id=${props.match.params.id}`);
					if(data._embedded){
                        setData(data._embedded.venues[0]);
                        setLoading(false);
                    }
                    else{
                        setError(true);
                    }
				} catch (e) {
					console.log(e);
				}
			}
			fetchData();
		},
		[ props.match.params.id ]
	);

    if(error){
        return(
            <NotFound></NotFound>
        )
    }

    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
            <div className='container'>
                <div className='div1'>
                    {data.name?<span className='venueTitle'>{data.name}</span>:<span></span>}
                    <dl>
                        <p className='leftAlign'>
                            <dt className='caption'>Address</dt><br/>
                            {data.address.line1&&data.city.name&&(data.state.stateCode||data.postalCode)?<dd>{data.address.line1}, {data.city.name}, {data.state.stateCode} {data.postalCode}</dd>:<span>N.A</span>}
                        </p>
                        <p className='leftAlign'>
                            <dt className='caption'>Upcoming Events</dt><br/>
                            {data.upcomingEvents &&data.upcomingEvents._total?<dd>{data.upcomingEvents._total} Events</dd>:<span>N.A</span>}
                        </p>
                        <br/>
                        {data.url?<a rel='noopener noreferrer' target='_blank' href={data.url} className='tickets'>View Tickets</a>:<span></span>}
                    </dl>
                </div>
                <div className='div2'>
                    <img className='venueImage' src={data.images&&data.images[0] ? data.images[0].url:noImage} alt={data.name}/>
                </div>
                <div className='div3'>
                    <p className='leftAlign'>
                        <dt className='caption'>What are the box office phone numbers?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.phoneNumberDetail?<dd>{data.boxOfficeInfo.phoneNumberDetail}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>When is the box office open?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.openHoursDetail?<dd>{data.boxOfficeInfo.openHoursDetail}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>What payment types are accepted?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.acceptedPaymentDetail?<dd>{data.boxOfficeInfo.acceptedPaymentDetail}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>What are the will call rules?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.willCallDetail?<dd>{data.boxOfficeInfo.willCallDetail}</dd>:<span>N.A</span>}
                    </p>
                </div>
                <div className='div4'>
                    <p className='leftAlign'>
                        <dt className='caption'>What are the parking options at {data.name}?</dt><br/>
                        {data.parkingDetail?<dd>{data.parkingDetail}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>Is there accessible seating?</dt><br/>
                        {data.accessibleSeatingDetail?<dd>{data.accessibleSeatingDetail}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>What are the general rules of {data.name}?</dt><br/>
                        {data.generalInfo&&data.generalInfo.generalRule?<dd>{data.generalInfo.generalRule}</dd>:<span>N.A</span>}
                    </p>
                    <p className='leftAlign'>
                        <dt className='caption'>Are children allowed?</dt><br/>
                        {data.generalInfo&&data.generalInfo.childRule?<dd>{data.generalInfo.childRule}</dd>:<span>N.A</span>}
                    </p>
                    <br/>
                    <p className='leftAlign'><Link to='/venues/page/1' className='link'>Back to all Venues...</Link></p>
                </div>
            </div>
        );
    }
};

export default VenueInfo;
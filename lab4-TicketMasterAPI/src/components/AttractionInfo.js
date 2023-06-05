import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import youtube from '../img/youtube.png';
import facebook from '../img/facebook.png';
import instagram from '../img/Instagram.png';
import spotify from '../img/spotify.png';
import lastfm from '../img/lastfm.png';
import itunes from '../img/itunes.png';
import twitter from '../img/Twitter.png';
import { Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import NotFound from './NotFound';
import '../App.css';

const AttractionInfo = (props) => {
	const [ data, setData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
    const [ error, setError] = useState(false);
	
	useEffect(
		() => {
			console.log ("useEffect fired")
			async function fetchData() {
				try {
					const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&id=${props.match.params.id}`);
					if(data._embedded){
                        setData(data._embedded.attractions[0]);
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
        let url=null;
		data.images.forEach(image => {
			if(image.width===2048 & image.height===1152){
				url=image.url;
			}
		});
        
		return (
            <Card className='card' variant='outlined'>
				<CardHeader className='titleHead' title={data.name} />
				<CardMedia
					className='media'
					component='img'
					image={ url ? url : noImage}
					title={data.name+' image'}
				/>

				<CardContent>
                <Typography component={'div'} variant='h6'>
                    <dl>
                        <p>
                            <dt className='title'>Classifications:</dt>
                            {data.classifications[0] && data.classifications[0].segment.name && data.classifications[0].genre && data.classifications[0].subGenre ?(<dd>{data.classifications[0].segment.name + ' | ' + data.classifications[0].genre.name + ' | ' + data.classifications[0].subGenre.name}</dd>):(<span></span>)}
                        </p>
                        <p>
                            <dt className='title'>Upcoming Events:</dt>
                            {data.upcomingEvents && data.upcomingEvents._total?<dd>{data.upcomingEvents._total} events</dd>:<span></span>}
                        </p>
                        {data.url?<a rel='noopener noreferrer' target='_blank' href={data.url} className='tickets'>View Tickets</a>:<span></span>}
                        <br></br>
                        {data.externalLinks && (data.externalLinks.youtube ||data.externalLinks.twitter||data.externalLinks.facebook||data.externalLinks.instagram||data.externalLinks.itunes||data.externalLinks.lastfm||data.externalLinks.spotify)? (<p>Use below links to follow on social media</p>):(<span></span>)}
                    </dl>
                </Typography>
                <div className='parent'>
                {data.externalLinks && data.externalLinks.youtube ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.youtube[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={youtube}
                            title='youtube logo'
                        />
                    </a></div>):(<span></span>)}
                    {data.externalLinks && data.externalLinks.twitter ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.twitter[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={twitter}
                            title='twitter logo'
                        />
                    </a></div>):(<span></span>)}
                    {data.externalLinks && data.externalLinks.facebook ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.facebook[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={facebook}
                            title='facebook logo'
                        />
                    </a></div>):(<span></span>)}
                    {data.externalLinks && data.externalLinks.instagram ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.instagram[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={instagram}
                            title='instagram logo'
                        />
                    </a></div>):(<span></span>)}
                    {data.externalLinks && data.externalLinks.itunes ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.itunes[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={itunes}
                            title='itunes logo'
                        />
                    </a></div>):(<span></span>)}
                    {data.externalLinks && data.externalLinks.lastfm ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.lastfm[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={lastfm}
                            title='last Fm logo'
                        />
                    </a></div>):<span></span>}
                    {data.externalLinks && data.externalLinks.spotify ? (<div className='child'><a rel='noopener noreferrer' target='_blank' href={data.externalLinks.spotify[0].url}>
                        <CardMedia
                            className='icon'
                            component='img'
                            image={spotify}
                            title='twitter image'
                        />
                    </a></div>):(<span></span>)}
                </div>
                <br></br>
                    <Typography>
                        <Link to='/attractions/page/1' className='link'>Back to all attractions...</Link>
					</Typography>
				</CardContent>
			</Card>
        );
    }
};

export default AttractionInfo;
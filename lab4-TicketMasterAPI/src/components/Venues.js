import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import Pagination from './Pagination';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import SearchForm from './SearchForm';
import NotFound from './NotFound';

const Venues = (props) => {
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [url,setUrl] = useState('');
	const [ data, setData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
    const [ error, setError] = useState(false);
    let card = null;
 

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/venues?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&keyword=' + searchTerm);
					if(data._embedded){
                        setSearchData(data._embedded.venues);
                        setLoading(false);
                    }
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

	useEffect(
		()=>{
			console.log('pagination fired');
			async function fetchData() {
				try {
					console.log(`in fetch page: ${parseInt(props.match.params.page)}`);
					if(parseInt(props.match.params.page)<1 || parseInt(props.match.params.page)>50){
						setLoading(false);
					}
					else{
					const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/venues?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&page=' + (parseInt(props.match.params.page)-1));
					setUrl('/venues/page/');
					if(data._embedded){
						setData(data._embedded.venues);
						setLoading(false);
					}
					else{
                        setError(true);
                    }
					}
				} catch (e) {
					console.log(e);
				}
			}
				console.log ('page is set')
				fetchData();
		},
		[ props.match.params.page ]
	);

    const searchValue = async (value) => {
		setSearchTerm(value);
	};

    const buildCard = (event)=>{
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={event.id}>
				<Card className='card' variant='outlined'>
					<CardActionArea>
						<Link to={`/venues/${event.id}`}>
							<CardMedia
								className='venueMedia'
								component='img'
								image={event.images&&event.images[0].url ? event.images[0].url : noImage}
								title='event image'
							/>

							<CardContent>
								<Typography className='titleHead' variant='h5' component='h2'>
									{event.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
        )
    }
    if(error){
        return(
            <NotFound></NotFound>
        )
    }
    if (searchTerm) {
		card =
			searchData &&
			searchData.map((event) => {
				return buildCard(event);
			});
	}else{
		card =
			data &&
			data.map((event) => {
				return buildCard(event);
			});}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
                <span className='heading'>Venues</span>
                <br/>
                <br/>
				<SearchForm searchValue={searchValue} />
				
				<br/>
				<br/>
				{searchTerm?<span></span>:<Pagination pageNumber={parseInt(props.match.params.page)} url={url}/>}
				<br />
				<br />
				<Grid container className='grid' spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default Venues;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import Pagination from './Pagination';
import SearchForm from './SearchForm';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import NotFound from './NotFound';

const Attractions = (props) => {
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
					const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&keyword=' + searchTerm);
					if(data._embedded){
                        setSearchData(data._embedded.attractions);
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
					console.log(`in fetch page: ${props.match.params.page}`);
					if(parseInt(props.match.params.page)<1 || parseInt(props.match.params.page)>50){
						setLoading(false);
					}
					else{
					const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&page=' + (parseInt(props.match.params.page)-1));
					if(data._embedded){
						setUrl('/attractions/page/');
						setData(data._embedded.attractions);
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
		let urlImage=null;
		event.images.forEach(image => {
			if(image.width===1024 & image.height===576){
				urlImage=image.url;
			}
		});
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={event.id}>
				<Card className='card' variant='outlined'>
					<CardActionArea>
						<Link to={`/attractions/${event.id}`}>
							<CardMedia
								className='media'
								component='img'
								image={urlImage ? urlImage : noImage}
								title='event image'
							/>

							<CardContent>
								<Typography className='titleHead' variant='h5' component='h2'>
									{event.name}
								</Typography>
								<Typography variant='body1' component='span'>
									{event.classifications[0] && event.classifications[0].segment.name && event.classifications[0].genre && event.classifications[0].subGenre ?(<p className='link'>{event.classifications[0].segment.name + ' | ' + event.classifications[0].genre.name + ' | ' + event.classifications[0].subGenre.name}</p>):(<span></span>)}
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
			});
		}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
				<span className='heading'>Attractions</span>
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

export default Attractions;

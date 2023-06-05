import Layout from "@/components/components/MyLayout";
import axios from 'axios';
import Link from "next/link";
import noImage from '../../../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import { useRouter } from "next/router";
import Error from "@/components/components/404";
import Image from "next/image";

export default function attractions({events,totalPages}){
    const router = useRouter()
    const page = parseInt(router.query.page || '1')

    const prevPage = page > 1 ? page - 1 : null
    const nextPage = page < totalPages ? page + 1 : null
    let url = `/venues/page/1`
    if(page>0 && page<51 && Array.isArray(events)){
    return(
    <Layout>
        <br/>   
        <span className='heading'>Venues</span>
        <br/>
		<br/>
        <div className="parent">
          {prevPage ? (
            <Link href={`/venues/page/${prevPage}`}>
            <div className="child">
                <button className="tickets">Prev</button>
            </div>
            </Link>
          ):(
            <div className="child">
                <button disabled>Prev</button>
            </div>
          )}
          {page && (
            <div className="child">
                <span className="caption">{page}</span>
            </div>
          )}
          {nextPage ? (
            <Link href={`/venues/page/${nextPage}`}>
            <div className="child">
              <button className="tickets">Next</button>
            </div>
            </Link>
          ):(
            <div className="child">
                <button disabled>Next</button>
            </div>
          )}
        </div>
        <br />
		<br />
        <Grid container className='grid' spacing={5}>
            {events && events.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={event.id}>
				<Card className='card' variant='outlined'>
					<CardActionArea>
						<Link href={`/venues/${event.id}`}>
							<Image
								className='venueMedia'
								component='img'
								src={event.images&&event.images[0].url ? event.images[0].url : noImage}
								alt='venue image'
                                width={345}
                                height={200}
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
            ))}
        </Grid>
    </Layout>
    )}
    else{
        return(
            <Layout>
                <Error url={url} code={events.code} msg={events.msg}></Error>
            </Layout>
        );
    }
}

async function getEventsData(page){
    try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/venues?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&page=' + (parseInt(page)-1));
        if(data._embedded){
            return data._embedded.venues
        }
    } catch (error) {
        return {code:error.response.status,msg:error.response.statusText}
    }
}

export async function getServerSideProps({params}){
    const page = parseInt(Number(params.page));   
    const events = await getEventsData(page);
    const totalPages = 50;
    return{
        props:{
            events,
            totalPages}
    };
}
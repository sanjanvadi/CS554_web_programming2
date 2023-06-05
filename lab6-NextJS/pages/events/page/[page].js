import Layout from "@/components/components/MyLayout";
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import noImage from '../../../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import { useRouter } from "next/router";
import Error from "@/components/components/404";

export default function events({events,totalPages}){
    const router = useRouter()
    const page = parseInt(router.query.page || '1')

    const prevPage = page > 1 ? page - 1 : null
    const nextPage = page < totalPages ? page + 1 : null
    let url = `/events/page/1`
    if(page>0 && page<51 && Array.isArray(events)){
    return(
    <Layout>
        <br/>   
        <span className='heading'>Events</span>
        <br/>
		<br/>
        <div className="parent">
          {prevPage ? (
            <Link href={`/events/page/${prevPage}`}>
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
            <Link href={`/events/page/${nextPage}`}>
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
                            <Link href={`/events/${event.id}`}>
                                <Image
                                    className='media'
                                    component='img'
                                    src={event.images ? getImage(event) : noImage}
                                    alt='event image'
                                    width={345}
                                    height={200}
                                />

                                <CardContent>
                                    <Typography className='titleHead' gutterBottom variant='h5' component='h2'>
                                        {event.name?<p>{event.name}</p>:<span></span>}
                                    </Typography>
                                    <Typography variant='body1' component={'div'}>
                                        {event.classifications&&event.classifications[0] && event.classifications[0].segment.name && event.classifications[0].genre && event.classifications[0].subGenre ?(<p className='link'>{event.classifications[0].segment.name + ' | ' + event.classifications[0].genre.name + ' | ' + event.classifications[0].subGenre.name}</p>):(<span></span>)}
                                    </Typography>
                                    <Typography variant='body2' component={'div'}>
                                        {event.dates.start?(<p className='link'>Starts from : {convertDate(event.dates.start.localDate)}</p>):(<span></span>)}
                                        {event.priceRanges?(<p className='link'>Price : ${event.priceRanges[0].min.toString()} - ${event.priceRanges[0].max.toString()}</p>):<span></span>}
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

function getImage(event){
    let url =''
    event.images.forEach(image => {
        if(image.width===1024 & image.height===576){
            url =  image.url;
        }
    });
    return url;
}

function convertDate(date) {
    var dob = new Date(date);
    dob.setDate(dob.getDate()+1);
    var dobArr = dob.toDateString().split(' ');
    var dobFormat = dobArr[2] + ' ' + dobArr[1] + ' ' + dobArr[3];
    return dobFormat;
}

async function getEventsData(page){
    try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/events?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&page=' + (parseInt(page)-1));
        if(data._embedded){
            return data._embedded.events
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
import Layout from "@/components/components/MyLayout";
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import noImage from '../../../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import { useRouter } from "next/router";
import Error from "@/components/components/404";

export default function attractions({events,totalPages}){
    const router = useRouter()
    const page = parseInt(router.query.page || '1')

    const prevPage = page > 1 ? page - 1 : null
    const nextPage = page < totalPages ? page + 1 : null
    let url = `/attractions/page/1`
    if(page>0 && page<51 && Array.isArray(events)){
    return(
    <Layout>
        <br/>   
        <span className='heading'>Attractions</span>
        <br/>
		<br/>
        <div className="parent">
          {prevPage ? (
            <Link href={`/attractions/page/${prevPage}`}>
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
            <Link href={`/attractions/page/${nextPage}`}>
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
                            <Link href={`/attractions/${event.id}`}>
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
    event.images && event.images.forEach(image => {
        if(image.width===1024 & image.height===576){
            url =  image.url;
        }
    });
    return url;
}

async function getEventsData(page){
    try {
        const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/attractions?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&countryCode=US&page=' + (parseInt(page)-1));
        if(data._embedded){
            return data._embedded.attractions
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
import Layout from "@/components/components/MyLayout";
import axios from "axios";
import Image from "next/image";
import noImage from '../../../img/download.jpeg';
import youtube from '../../../img/youtube.png';
import facebook from '../../../img/facebook.png';
import instagram from '../../../img/Instagram.png';
import spotify from '../../../img/spotify.png';
import lastfm from '../../../img/lastfm.png';
import itunes from '../../../img/itunes.png';
import twitter from '../../../img/Twitter.png';
import Error from "@/components/components/404";
import { Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import Link from "next/link";

export default function event({data}){
    if(data && data.name){
        let url=null;
		data.images && data.images.forEach(image => {
			if(image.width===2048 && image.height===1152){
				url=image.url;
			}
		});
        function convertDate(date) {
			let dob = new Date(date);
            dob.setDate(dob.getDate()+1);
			let dobArr = dob.toDateString().split(' ');
			let dobFormat = dobArr[2] + ' ' + dobArr[1] + ' ' + dobArr[3];
			return dobFormat;
		}
        function convertTime(time){
            let timeArr=time.split(':');
            let DN = 'AM';
            if(Number(timeArr[0])>12){
                timeArr[0]=Number(timeArr[0])-12;
                DN='PM';
            }
            return `${timeArr[0]}:${timeArr[1]} ${DN}`;
        }
        function splitByT(dateTime){
            let dateTimeArr = dateTime.split('T');
            let date = convertDate(dateTimeArr[0]);
            let time = convertTime(dateTimeArr[1]);
            return date +' '+time;
        }

        const buildPreSale=(event)=>{
            return(
                <Typography component='span' key={event.name}>
                    <dt className='title'>{event.name?(event.name):(<span>N.A</span>)}:</dt>
                    {event ? (<dd className='preSaleName'>{splitByT(event.startDateTime)} - {splitByT(event.endDateTime)}<br/></dd>):<span>N.A</span>}

                </Typography>
            )
        }

        let block=null;
        if(data.sales.presales){
            block =
            data.sales.presales &&
            data.sales.presales.map((event) => {
                    return buildPreSale(event);
                });
            }
        return(
            <Layout>
                <br/>
                <br/>
                <Card className='card' variant='outlined'>
				<CardHeader className='titleHead' style={{borderBottom:'1px solid #1799fb',fontWeight:'bold',fontSize:'50px',color:'#1799fb'}} title={data.name} />
				<CardMedia
					className='media'
					component='img'
					image={ url ? url : noImage}
					title={data.name+' image'}
				/>

				<CardContent>
                <Typography component='span' variant='h6'>
                    <dl>
                        <dt className='title'>Classifications:</dt>
                        {data.classifications[0] && data.classifications[0].segment.name && data.classifications[0].genre && data.classifications[0].subGenre ?(<dd>{data.classifications[0].segment.name + ' | ' + data.classifications[0].genre.name + ' | ' + data.classifications[0].subGenre.name}</dd>):(<span>N.A</span>)}
                        <br/><br/>
                        <dt className='title'>Start Date:</dt>
                        {data.dates.start&&data.dates.start.localDate?(<dd>{convertDate(data.dates.start.localDate)}</dd>):(<span>N.A</span>)}
                        <br/>
                        <dt className='title'>Stat Time:</dt>
                        {data.dates.start&&data.dates.start.localTime?(<dd>{convertTime(data.dates.start.localTime)}</dd>):(<span>N.A</span>)}
                        <br/>
                        <dt className='title'>Price:</dt>
                        {data.priceRanges&&data.priceRanges[0]&&data.priceRanges[0].min&&data.priceRanges[0].max?(<dd>${data.priceRanges[0].min.toString()} - ${data.priceRanges[0].max.toString()}</dd>):<span>N.A</span>}
                        <br/><br/>
                        <dt className='title'>Pre-Sales</dt><br/>
                        {block}
                        <br/>
                        <dt className='title'>Public Sales:</dt>
                        {data.sales.public&&data.sales.public.startDateTime&&data.sales.public.endDateTime?(<dd>{splitByT(data.sales.public.startDateTime)} - {splitByT(data.sales.public.endDateTime)}</dd>):<span>N.A</span>}
                        <br/><br/>
                        <dt className='title'>Upcoming Events:</dt>       
                        {data._embedded.attractions && data._embedded.attractions[0].upcomingEvents && data._embedded.attractions[0].upcomingEvents._total?<dd>{data._embedded.attractions[0].upcomingEvents._total} events</dd>:<span>N.A</span>}
                        <br/><br/>
                        {data.url?<Link rel='noopener noreferrer' target='_blank' href={data.url} className='tickets'>View Tickets</Link>:<span></span>}
                        <br></br>
                        {data._embedded.attractions && data._embedded.attractions[0].externalLinks && (data._embedded.attractions[0].externalLinks.youtube ||data._embedded.attractions[0].externalLinks.twitter||data._embedded.attractions[0].externalLinks.facebook||data._embedded.attractions[0].externalLinks.instagram||data._embedded.attractions[0].externalLinks.itunes||data._embedded.attractions[0].externalLinks.lastfm||data._embedded.attractions[0].externalLinks.spotify)? (<p>Use below links to follow on social media</p>):(<span></span>)}
                    </dl>
                </Typography>
                <div className='parent'>
                    {data._embedded.attractions &&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.youtube ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.youtube[0].url}>
                        <Image className='icon' src={youtube} alt='youtube logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.twitter ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.twitter[0].url}>
                        <Image className='icon' src={twitter} alt='twitter logo' width={50} height={50} />
                        </Link>
                    </div>):(<span></span>)}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.facebook ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.facebook[0].url}>
                        <Image className='icon' src={facebook} alt='facebook logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.instagram ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.instagram[0].url}>
                        <Image className='icon' src={instagram} alt='instagram logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.itunes ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.itunes[0].url}>
                        <Image className='icon' src={itunes} alt='itunes logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.lastfm ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.lastfm[0].url}>
                        <Image className='icon' src={lastfm} alt='last Fm logo' width={50} height={50}/>
                        </Link>
                    </div>):<span></span>}
                    {data._embedded.attractions&&data._embedded.attractions[0].externalLinks &&
                    data._embedded.attractions[0].externalLinks.spotify ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data._embedded.attractions[0].externalLinks.spotify[0].url}>
                        <Image className='icon' src={spotify} alt='twitter image' width={50} height={50}/>
                            </Link>
                        </div>):(<span></span>)}
                    </div>
                    <br></br>
                    <Typography>
                        <Link href={'/events/page/1'} className='link'>Back to all Events...</Link>
					</Typography>
				</CardContent>
			</Card>
            </Layout>
    )}
    else{
        let url = '/events/page/1'; 
        return(
            <Layout>
                <Error url={url} code={data.code} msg={data.msg}></Error>
            </Layout>
        );
    }
}

async function getEventData(id){
    try {
        const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&id=${id}`);
        if(data._embedded){
            return data._embedded.events[0];
        }
        else{
            return {code:'400',msg:'BAD REQUEST'};
        }
    } catch (error) {
        return {code:error.response.status,msg:error.response.statusText}
    }
}

export async function getServerSideProps({params}) {
    const id = params.id.toString();
    const data = await getEventData(id);
    return {
      props: {data}
    };
  }
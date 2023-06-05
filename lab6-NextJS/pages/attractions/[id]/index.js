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

export default function attraction({data}){
        
        
    if(data && data.name){
        let url=null;
		data.images.forEach(image => {
			if(image.width===2048 && image.height===1152){
				url=image.url;
			}
		});
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
                        {data.classifications[0] && data.classifications[0].segment.name && data.classifications[0].genre && data.classifications[0].subGenre ?(<dd>{data.classifications[0].segment.name + ' | ' + data.classifications[0].genre.name + ' | ' + data.classifications[0].subGenre.name}</dd>):(<span></span>)}
                        <br/><br/>
                        <dt className='title'>Upcoming Events:</dt>
                        {data.upcomingEvents && data.upcomingEvents._total?<dd>{data.upcomingEvents._total} events</dd>:<span></span>}
                        <br/><br/>
                        {data.url?<Link rel='noopener noreferrer' target='_blank' href={data.url} className='tickets'>View Tickets</Link>:<span></span>}
                        <br></br>
                        {data.externalLinks && (data.externalLinks.youtube ||data.externalLinks.twitter||data.externalLinks.facebook||data.externalLinks.instagram||data.externalLinks.itunes||data.externalLinks.lastfm||data.externalLinks.spotify)? (<p>Use below links to follow on social media</p>):(<span></span>)}
                    </dl>
                </Typography>
                <div className='parent'>
                    {data.externalLinks &&
                    data.externalLinks.youtube ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.youtube[0].url}>
                        <Image className='icon' src={youtube} alt='youtube logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data.externalLinks &&
                    data.externalLinks.twitter ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.twitter[0].url}>
                        <Image className='icon' src={twitter} alt='twitter logo' width={50} height={50} />
                        </Link>
                    </div>):(<span></span>)}
                    {data.externalLinks &&
                    data.externalLinks.facebook ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.facebook[0].url}>
                        <Image className='icon' src={facebook} alt='facebook logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data.externalLinks &&
                    data.externalLinks.instagram ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.instagram[0].url}>
                        <Image className='icon' src={instagram} alt='instagram logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data.externalLinks &&
                    data.externalLinks.itunes ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.itunes[0].url}>
                        <Image className='icon' src={itunes} alt='itunes logo' width={50} height={50}/>
                        </Link>
                    </div>):(<span></span>)}
                    {data.externalLinks &&
                    data.externalLinks.lastfm ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.lastfm[0].url}>
                        <Image className='icon' src={lastfm} alt='last Fm logo' width={50} height={50}/>
                        </Link>
                    </div>):<span></span>}
                    {data.externalLinks &&
                    data.externalLinks.spotify ? (<div className='child'>
                        <Link rel='noopener noreferrer' target='_blank'
                            href={data.externalLinks.spotify[0].url}>
                        <Image className='icon' src={spotify} alt='twitter image' width={50} height={50}/>
                            </Link>
                        </div>):(<span></span>)}
                    </div>
                    <br></br>
                    <Typography>
                        <Link href={'/attractions/page/1'} className='link'>Back to all Attractions...</Link>
					</Typography>
				</CardContent>
			</Card>
            </Layout>
    )}
    else{
        let url = '/attractions/page/1'
        return(
            <Layout>
                <Error url={url} code={data.code} msg={data.msg}></Error>
            </Layout>
        );
    }
}

async function getEventData(id){
    try {
        const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&id=${id}`);
        ;
        if(data._embedded){
            return data._embedded.attractions[0];
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
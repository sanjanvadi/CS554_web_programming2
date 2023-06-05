import Layout from "@/components/components/MyLayout";
import axios from "axios";
import Image from "next/image";
import noImage from '../../../img/download.jpeg';
import Error from "@/components/components/404";
import Link from "next/link";

export default function venues({data}){
    if(data && data.name){
        return(
            <Layout>
                <br/><br/>
                <div className='container'>
                <div className='div1'>
                    {data.name?<span className='venueTitle'>{data.name}</span>:<span></span>}
                    <dl>
                        <span className='leftAlign'>
                            <dt className='caption'>Address</dt><br/>
                            {data.address.line1&&data.city.name&&(data.state.stateCode||data.postalCode)?<dd>{data.address.line1}, {data.city.name}, {data.state.stateCode} {data.postalCode}</dd>:<span>N.A</span>}
                        </span>
                        <br/><br/>
                        <span className='leftAlign'>
                            <dt className='caption'>Upcoming Events</dt><br/>
                            {data.upcomingEvents &&data.upcomingEvents._total?<dd>{data.upcomingEvents._total} Events</dd>:<span>N.A</span>}
                        </span>
                        <br/><br/>
                        {data.url?<Link rel='noopener noreferrer' target='_blank' href={data.url.toString()} className='tickets'>View Tickets</Link>:<span></span>}
                    </dl>
                </div>
                <div className='div2'>
                    <Image className='venueImage' src={data.images&&data.images[0] ? data.images[0].url:noImage} alt={data.name} width={345} height={200}/>
                </div>
                <div className='div3'>
                    <span className='leftAlign'>
                        <dt className='caption'>What are the box office phone numbers?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.phoneNumberDetail?<dd>{data.boxOfficeInfo.phoneNumberDetail}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>When is the box office open?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.openHoursDetail?<dd>{data.boxOfficeInfo.openHoursDetail}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>What payment types are accepted?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.acceptedPaymentDetail?<dd>{data.boxOfficeInfo.acceptedPaymentDetail}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>What are the will call rules?</dt><br/>
                        {data.boxOfficeInfo&&data.boxOfficeInfo.willCallDetail?<dd>{data.boxOfficeInfo.willCallDetail}</dd>:<span>N.A</span>}
                    </span>
                </div>
                <div className='div4'>
                    <span className='leftAlign'>
                        <dt className='caption'>What are the parking options at {data.name}?</dt><br/>
                        {data.parkingDetail?<dd>{data.parkingDetail}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>Is there accessible seating?</dt><br/>
                        {data.accessibleSeatingDetail?<dd>{data.accessibleSeatingDetail}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>What are the general rules of {data.name}?</dt><br/>
                        {data.generalInfo&&data.generalInfo.generalRule?<dd>{data.generalInfo.generalRule}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'>
                        <dt className='caption'>Are children allowed?</dt><br/>
                        {data.generalInfo&&data.generalInfo.childRule?<dd>{data.generalInfo.childRule}</dd>:<span>N.A</span>}
                    </span>
                    <br/><br/>
                    <span className='leftAlign'><Link href='/venues/page/1' className='link'>Back to all Venues...</Link></span>
                </div>
            </div>
            </Layout>
    )}
    else{
        let url = '/venues/page/1'
        return(
            <Layout>
                <Error url={url} code={data.code} msg={data.msg}></Error>
            </Layout>
        );
    }
}

async function getEventData(id){
    try {
        const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/venues?apikey=7ShMgZO4XCXJNbGkkI47LMDD9GDGXrpG&id=${id}`);
        ;
        if(data._embedded){
            return data._embedded.venues[0];
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
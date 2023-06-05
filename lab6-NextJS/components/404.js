import Link from "next/link";

const Error = (props)=>{
    return(
    <div>
        <p className="venueTitle">Error : {props.code}</p>
        <p className="caption">{props.msg}</p>
        <Link href={props.url}><button className="tickets">Back</button></Link>
    </div>
    );
}

export default Error;
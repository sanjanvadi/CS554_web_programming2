import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import NotFound from './NotFound';

const Pagination = (props) => {
	return (
		<div>
            {(props.pageNumber >=1 && props.pageNumber <= 50) ? (
					<div className='parent'>
						{props.pageNumber<=1 ? 
                        (<span></span>):
                        <div className='child'>
							<Link className='tickets' to={`${props.url}${parseInt(props.pageNumber) - 1}`}>Previous</Link>
						</div>}
						{props.pageNumber>=50 ? (<span></span>):<div className='child'>
							<Link className='tickets' to={`${props.url}${parseInt(props.pageNumber) + 1}`}>Next</Link>
						</div>}
					</div>
                ) : (<div>
						<div>
							<div>
                                <NotFound></NotFound>
								<br/>
								<Link className='link' to={`${props.url}1`}>Jump to first page</Link>
							</div>
						</div>
					</div>) 
            }
        </div>

	);
};

export default Pagination;

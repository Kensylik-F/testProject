import { useState } from 'react';
import './Seminar.scss'
import edit from '../../icon/edit.png'
import trash from '../../icon/trash-can.png'
interface ISeminarProps {
	id: number;
	title: string
	date: string;
	description: string;
	imageUrl: string
	viewMode: 'linear' | 'grid' | 'full'
	onDelete: (id: number) => void;
	onEdit: (id: number) => void
}


export const Seminar: React.FC<ISeminarProps> = ({
		id,
		title,
		date,
		description,
		onDelete,
		onEdit,
		viewMode,
		imageUrl}
	)=>{
	const [loading, setLoading] = useState(true)
	const handleError = () =>{
		setLoading(false)
	}
	const handleImgLoad = () =>{
		setLoading(false)
	}
	 
	return(
		<div className={`seminarCard ${viewMode}`} key={id}>
			{viewMode === 'full' && (
				<div className='imgContainer'>
					{loading &&(
						<div className='imgLoading'>
							<div className='loadingSpinner'></div>
						</div>
					)}
					<img 
						loading='lazy'
					    className="seminarImg"
						onError={handleError}
						onLoad={handleImgLoad}
						src={imageUrl} 
						style={{visibility: loading ? 'hidden' : 'visible'}}
						alt={title || 'seminar'} />
				</div>
			)}
			<h2>{title}</h2>
			<p>{description || 'Описание недоступно'}</p>
			<div>
				<p>{date}</p>
				<div className='btn'>
					<button onClick={()=> onEdit(id)}>
						<img src={edit}/>
					</button>
					<button onClick={()=> onDelete(id)}>
					<img src={trash}/>

					</button>
				</div>
			</div>
		</div>
	)
}
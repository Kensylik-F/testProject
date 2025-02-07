import { useEffect, useState } from "react";
import { Seminar } from "./Seminar/Seminar";
import { deleteFetch, fetchSeminar } from "../api/api";
import { SeminarModal } from "./Modal/SeminarModal";
import './SeminarList.scss'
import linaer from '../icon/linear.png'
import grid from '../icon/grid.png'
import full from '../icon/full.png'
interface ISeminar {
	id: number;
	title: string
	date: string;
	description: string;
	photo: string
}


export const SeminarList: React.FC = () =>{
	const [seminars, setSeminars] = useState<ISeminar[]>([]);
	const [editSeminar, setEditSeminar] = useState<ISeminar | null>(null)
	const [viewMode, setViewMode] = useState<"linear" | "grid" | "full">("linear")
	
	
	useEffect(()=>{
		const getSeminar = async () => {
			try {
			  const data = await fetchSeminar();
			  if (Array.isArray(data)) {
				setSeminars(data);
			  } else {
				console.error('Invalid seminar data format');
			  }
			} catch (error) {
			  console.error('Failed to fetch seminars', error);
			}
		  };
		  
		getSeminar()
	},[])

	const handleDelete = async(id:number)=>{
		if(window.confirm('delete?')){
			await deleteFetch(id)
			setSeminars(seminars.filter(s => s.id !== id))
		}
	}
	const handleEdit = (id:number)=>{
		console.log('edit')
		const seminar = seminars.find(s => s.id === id)
		if(seminar) setEditSeminar(seminar)
	}

	const handleUpdate = (updatedSeminar: ISeminar) => {
			setSeminars(prev=>
				prev.map(s => (s.id === updatedSeminar.id ? updatedSeminar : s))
			)
	}


	return (
		<div className="container">
			<div>
				<h1 className="label">Семинары:</h1>
				<div className="viewBtn">
					<button onClick={()=>setViewMode("linear")}>
						<img src={linaer} alt="" />
					</button>
					<button onClick={()=>setViewMode("grid")}>
						<img src={grid} alt="" />

					</button>
					<button onClick={()=>setViewMode("full")}>
						<img src={full} alt="" />

					</button>

				</div>
			</div>
			<div className={`seminarList ${viewMode}`}>
				{seminars.map(seminar =>(
					<Seminar 
						key={seminar.id} 
						{...seminar} 
						viewMode={viewMode}
						imageUrl={viewMode === 'full' ? seminar.photo :''}
						onDelete={handleDelete}
						onEdit={handleEdit}/>
				))}
			</div>
			<div>
				{editSeminar && (
					<SeminarModal 
					seminar={editSeminar}
					isOpen={Boolean(editSeminar)}
					onClose={()=> setEditSeminar(null)} 
					onUpdate={handleUpdate}
					/>
				)}
			</div>
		</div>
	);
}
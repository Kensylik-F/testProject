import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-modal'
import { updateFetch } from "../../api/api";
import './SeminarModal.scss'


interface ISeminar {
	id: number;
	title: string
	date: string;
	description: string;
	photo: string
}
interface IModalProps{
	seminar: ISeminar;
	onClose: () => void;
	isOpen: boolean
	onUpdate:(updateSeminar: ISeminar) =>void
}

Modal.setAppElement('#root')

export const SeminarModal: React.FC<IModalProps> = ({seminar,isOpen, onUpdate, onClose}) =>{

	const [formData, setFormData] = useState(seminar)
	const [previewImg, setPreviewImg] = useState<string | null>(seminar.photo)
	
	// блокируем страницу при открытом модальном окне
	useEffect(() => {
		if (isOpen) {
		  document.body.style.overflow = 'hidden';
		} else {
		  document.body.style.overflow = 'auto';
		}
	  
		return () => {
		  document.body.style.overflow = 'auto';
		};
	}, [isOpen]);
	
	// преобразование формата отображения даты
	useEffect(() => {
		if (seminar.date) {
			const parsedDate = Date.parse(seminar.date) ? seminar.date : null;
			if (parsedDate) {
				setFormData(prev => ({
					...prev,
					date: new Date(parsedDate).toISOString().substring(0, 10),
				}));
			}
		}
	}, [seminar.date]);
	
	const isFormValid = formData.title.trim() && formData.date.trim() && formData.description.trim();
	
	// обновляет данные формы
	const handleEdit = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { value, name } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	  }, []);
	// обрабатывает загрузку изображения, переобразуя файл в строку
	const handleEditImg = (e: React.ChangeEvent<HTMLInputElement>) =>{
		const file = e.target.files?.[0]
		if(file){
			const reader = new FileReader()
			reader.onload = () =>{
				setPreviewImg(reader.result as string)
				setFormData(prev => ({...prev, photo: reader.result as string}))
			}

			reader.readAsDataURL(file)
		}
	}

	// сохраняет данные 
	const handleSave = async() =>{
		try{
			const formatedDate = {
				...formData,
				date: formData.date.split('-').reverse().join('.')
			}
			const updateSeminar = await updateFetch(formatedDate, formData.id)
			if(updateSeminar){
				onUpdate(updateSeminar)
				onClose()
			}
		}catch(e){
			console.log(`ошибка сохранения данных: ${e}`)
			alert('Не удалось сохранить изменения! Повторите попытку.')
		}
	}
	// возвращает класс для стилизации
	const getClassForInput = (value: string) => {
		return value.trim() ? "filled" : "error";
	  };

	return(
		<Modal
			className='modal'
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel="edit seminar"
		>
			<h2 className="title">Edit Seminar</h2>
			<input 
				type="text"
				name="title"
				value={formData.title} 
				placeholder="title"
				onChange={handleEdit}
				className={getClassForInput(formData.title)}
			/>
			<input 
				type="date" 
				name="date"
				value={formData.date}
				onChange={handleEdit}
				className={getClassForInput(formData.date)}
			/>
			<textarea
				name="description"
				value={formData.description}
				placeholder="description"
				onChange={handleEdit}
				className={getClassForInput(formData.description)}
			/>
			<div>
				<label>Upload image</label>
				<input 
					type="file" 
					onChange={handleEditImg} 
					accept="image/*"/>

				{
					previewImg &&(
						<img 
							src={previewImg} 
							alt=""
							style={{ width: '100%', maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }} 
							 />
					)
				}
			</div>
			<div>
				<button onClick={onClose}>cancel</button>
				<button onClick={handleSave} disabled={!isFormValid}>save</button>
			</div>
		</Modal>
	)

}
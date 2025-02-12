import React, { useEffect } from "react";
import Modal from 'react-modal'
import { updateFetch } from "../../api/api";
import './SeminarModal.scss'
import { useForm } from 'react-hook-form'

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

	const {register,watch,setValue,reset ,formState:{errors, isValid}, handleSubmit } = useForm<ISeminar>({
		defaultValues: seminar,
		mode: 'onChange'
	})
	
	useEffect(() => {
		if (isOpen) {
			reset(seminar)
		  document.body.style.overflow = 'hidden';
		} else {
		  document.body.style.overflow = 'auto';
		}
		return () => {
		  document.body.style.overflow = 'auto';
		};
	}, [isOpen,seminar,reset]);
	
	// обрабатывает загрузку изображения, переобразуя файл в строку
	const handleEditImg = (e: React.ChangeEvent<HTMLInputElement>) =>{
		const file = e.target.files?.[0]
		if(file){
			const reader = new FileReader()
			reader.onload = () =>{
				setValue('photo',reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const onSubmit = async (data: ISeminar) =>{
		try{
			const formatedDate = {
				...data, date: data.date.split('-').reverse().join('.')}
			const updateSeminar = await updateFetch(formatedDate, seminar.id)
			if(updateSeminar){
				onUpdate(updateSeminar)
				onClose()
			}
		}catch(e){
			console.log(`ошибка сохранения данных: ${e}`)
			alert('Не удалось сохранить изменения! Повторите попытку.')
		}
	}
	const getClassForInput = (value: keyof ISeminar) => {
		return errors[value] ? "error" : watch(value) ? 'filled' : '';
	  };
	return(
		<Modal
			className='modal'
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel="edit seminar"
		> 
			<form onSubmit={handleSubmit(onSubmit)}>
				<h2 className="title">Edit Seminar</h2>
				<input 
					{...register('title', {
						required: 'Заполните поле',
						minLength:{
							value: 0,
							message: 'Поле не может быть пустым'
						}
					})}
					type="text"
					placeholder="title"
					className={getClassForInput('title')}
				/>
				{errors.title && <div className="MessegeError">{errors.title.message}</div>}
				<input 
					type="date" 
					{...register('date', {required: 'введите дату'})}
					className={getClassForInput('title')}
				/>
				{errors.date && <div className="MessegeError">{errors.date.message}</div>}
				<textarea
					{...register('description', {required: 'введите описание'})}
					placeholder="description"
					className={getClassForInput('description')}
				/>
				{errors.description && <div className="MessegeError">{errors.description.message}</div>}
				<div>
					<label>Upload image</label>
					<input 
						type="file" 
						{...register('photo',)}
						onChange={handleEditImg} 
						accept="image/*"/>

					{
						watch('photo') &&(
							<img 
								src={watch('photo')} 
								alt=""
								style={{ width: '100%', maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }} 
								 />
						)
					}
				</div>
				<div>
					<button onClick={onClose}>cancel</button>
					<button type="submit" disabled={!isValid}>save</button>
				</div>
			</form>

		</Modal>
	)

}
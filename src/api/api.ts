import axios from "axios"
import {toast} from 'react-toastify'
interface ISeminar {
	id: number;
	title: string;
	date: string;
	description: string;
	photo: string;
  }
const URL = 'http://localhost:3001/seminars'

export const fetchSeminar = async() =>{
	try{
		const res = await axios.get(URL)
		return res.data
	}catch(e){
		console.error(`Произошла ошибка: ${e}`)
		return
	}
}

export const deleteFetch = async(id:number) =>{
	try{
		await axios.delete(`${URL}/${id}`)
		toast.success('Семинар успешно удален.')
	}catch(e){
		toast.error('Ошибка при удалении семинара.')
		console.error(`Произошла ошибка: ${e}. Повторите попытку`)
	}
}

export const updateFetch = async(data: ISeminar, id:number): Promise<ISeminar | null> => {
	try{
		const res = await axios.put<ISeminar>(`${URL}/${id}`, data)
		return res.data

	}catch(e){
		toast.error('Ошибка при редактировании семинара.')
		console.error(`Произошла ошибка: ${e}. Повторите попытку`)
		return null
	}
}
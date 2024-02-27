import {AlertPropsType} from '../../types/types'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ModernAlert: AlertPropsType = (text, time = 2000) => {
    toast.success(text)

    setTimeout(() => {
        window.location.reload()
    }, time)
}        
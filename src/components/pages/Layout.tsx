import {useMemo, useContext} from 'react'
import {ToastContainer} from 'react-toastify'
import {Context} from '../../context/WebProvider'
import Router from '../router/Router'
import {init} from '../../store/localstorage'

import 'react-toastify/dist/ReactToastify.css'

const Layout = () => {
    const {change_context, context} = useContext(Context)

    useMemo(() => {
        change_context('create', null)
        init()
    }, [context])

    return (
        <div className='main'>
            <Router account_id={context.account_id} username={context.username} />
            <ToastContainer theme='dark' autoClose={1000} />
        </div>
    )
}

export default Layout
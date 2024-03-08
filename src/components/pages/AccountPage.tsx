import {useState, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import UAParser from 'ua-parser-js'
import {PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import Loading from '../UI/Loading'
import FormPagination from '../UI/FormPagination'
import ImageLook from '../UI/ImageLook'
import {getProfileM} from '../../graphql/pages/ProfilePageQueries'
import components, {default_component} from '../account/index'

const AccountPage = () => {
    const parser = new UAParser()
    const centum = new Centum()

    const {change_context, context} = useContext(Context)
    const [profile, setProfile] = useState(null)
    const [page, setPage] = useState(default_component)
    const [pageIndex, setPageIndex] = useState<number>(0)   
    const [info] = useState(parser.getResult())  
    
    
    const [getProfile] = useMutation(getProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            let info = data.getProfile

            if (info === null) {
                change_context('update', null)
            } else {
                setProfile(info)
            }
        }
    })
    
    useMemo(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: context.account_id
                }
            })

            centum.title('Home', PROJECT_TITLE)
            centum.favicon('favicon')
            console.log(info)
        }
    }, [context.account_id])
    
    useMemo(() => {
        let result = components[pageIndex]

        setPage(result)
    }, [pageIndex])
    
    return (
        <>
            {profile !== null && 
                <>
                    <FormPagination num={pageIndex} setNum={setPageIndex} items={components.map(el => el.component)}>
                        {page !== null && 
                            <div className='item'>
                                <ImageLook src={page.icon} min={2} max={2} className='icon' />
                            </div>
                        }
                    </FormPagination>

                    <div className='main profile'>
                        {page !== null && <page.component profile={profile} context={context} />}             
                    </div>

                    <h5 className='tech-info'>Running on {info.os.name} {info.os.version}</h5>
                </>
            }

            {profile === null && <Loading />}
        </>
    )
}

export default AccountPage
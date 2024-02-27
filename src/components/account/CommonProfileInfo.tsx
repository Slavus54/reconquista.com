import {useState} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import foundations from '../../env/foundations.json'
import FlagPhoto from '../../assets/ukraine.png'
import {CHARITY_GOALS, EURO_ICON, PROTECT_UKR_NOW} from '../../env/env'
import ImageLook from '../UI/ImageLook'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfileCommonInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const CommonProfileInfo = ({profile, context}: AccountPageComponentProps) => {   
    const [state, setState] = useState({
        goal: profile.goal, 
        budget: profile.budget
    })

    const centum = new Centum()

    const {goal, budget} = state    

    const [updateProfileCommonInfo] = useMutation(updateProfileCommonInfoM, {
        onCompleted(data) {
            ModernAlert(data.updateProfileCommonInfo)
        }
    })

    const onProtect = () => {
        centum.go(PROTECT_UKR_NOW)
    }

    const onView = (url: string) => {
        centum.go(url)
    }

    const onUpdate = () => {
        updateProfileCommonInfo({
            variables: {
                account_id: context.account_id, goal, budget
            }
        })
    }

    return (
        <>
            <h2>Aid to Ukraine</h2> 
            <img src={FlagPhoto} />
            <div className='items small'>
                {CHARITY_GOALS.map(el => <div onClick={() => setState({...state, goal: el})} className={el === goal ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <h4 className='pale'>Payment: <b>{budget}{EURO_ICON}</b>/month</h4>
            <input value={budget} onChange={e => setState({...state, budget: parseInt(e.target.value)})} type='range' step={1} />

            <button onClick={onUpdate}>Update</button>

            <h2>Foundations</h2>

            <div className='items half'>
                {foundations.map(el => 
                    <div onClick={() => onView(el.url)} className='item panel'>
                        {el.title}
                        <h5 className='pale'>{el.category}</h5>
                        <ImageLook src={el.icon} min={2} max={2} className='icon'alt='icon' />
                    </div>
                )}
            </div>

            <button onClick={onProtect} className='light'>Protect</button>
        </> 
    )
}

export default CommonProfileInfo
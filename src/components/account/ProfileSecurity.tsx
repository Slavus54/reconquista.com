import {useState, useMemo, useEffect} from 'react'
import {useMutation} from '@apollo/client'
import {PASSWORD_ATTEMPTS} from '../../env/env'
import uniqid from 'uniqid'
import {ModernAlert} from '../UI/ModernAlert'
import {updateProfilePasswordM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileSecurity = ({profile, context}: AccountPageComponentProps) => {
    const [flag, setFlag] = useState(false)
    const [attempts, setAttempts] = useState<number>(PASSWORD_ATTEMPTS)
    const [percent, setPercent] = useState<number>(50)
    const [state, setState] = useState({
        password: ''
    })

    const {password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            ModernAlert(data.updateProfilePassword)
        }
    })

    useMemo(() => {
        if (flag) {
            let length: number = Math.floor(percent / 10)
            let salt: string = profile.username.split(' ').join('').toLowerCase().slice(0, length)

            setState({...state, password: uniqid(salt)})
        }
    }, [flag, percent])

    useEffect(() => {
        if (attempts === 0) {
            window.location.reload()
        } else {
            setState({...state, password: ''})
        }
    }, [attempts])

    const onUpdate = async () => {
        if (flag) {
            updateProfilePassword({
                variables: {
                    account_id: context.account_id, password
                }
            })
        } else if (profile.password === password) {
            setFlag(true)
        } else {
            setAttempts(attempts > 0 ? attempts - 1 : 0)
        }
    }
    
    return (
        <>
          
            {flag ? 
                    <>
                        <h4 className='pale'>Level of Defense: {percent}%</h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                    </>
                :
                    <h4 className='pale'>You have {attempts} attempts to enter password</h4>                                   
            }

            <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />
        
            <button onClick={onUpdate}>{flag ? 'Update' : 'Confirm'}</button>
        </> 
    )
}

export default ProfileSecurity
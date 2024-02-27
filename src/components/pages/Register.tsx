import {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {CHARITY_GOALS, INITIAL_PERCENT, EURO_ICON, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {createProfileM} from '../../graphql/profile/ProfileQueries'
import {TownType} from '../../types/types'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [image, setImage] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        username: '', 
        password: '', 
        telegram: '',
        goal: CHARITY_GOALS[0], 
        budget: INITIAL_PERCENT,
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {username, password, telegram, goal, budget, region, cords} = state

    const [createProfile] = useMutation(createProfileM, {
        optimisticResponse: true,
        onCompleted(data) {
            console.log(data.createProfile)
            change_context('update', data.createProfile, 1)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])


    const onCreate = () => {
        createProfile({
            variables: {
                username, password, telegram, goal, budget, region, cords, main_photo: image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>What you name?</h4>
                        <input value={username} onChange={e => setState({...state, username: e.target.value})} placeholder='Fullname' type='text' />
                
                        <h4 className='pale'>Security</h4>
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />  
                        <ImageLoader setImage={setImage} />
                
                    </>,
                    <>
                        <h4 className='pale'>Connect to Telegram</h4>
                        <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Tag of profile' type='text' />

                        <h4 className='pale'>Aid to Ukraine</h4>
                        <div className='items small'>
                            {CHARITY_GOALS.map(el => <div onClick={() => setState({...state, goal: el})} className={el === goal ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Payment: <b>{budget}{EURO_ICON}</b>/month</h4>
                        <input value={budget} onChange={e => setState({...state, budget: parseInt(e.target.value)})} type='range' step={1} />
                    </>,
                    <>
                        <h4 className='pale'>Where are you?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>New Account</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default Register